import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import sortBy from "lodash/sortBy";
import { useRouter } from "next/router";
import { Spinner, Tabs, Tab } from "react-bootstrap";
import rulesParse from "../../../app/rules-parse";
import useTopRule from "../../components/modules/useTopRule";
import TocSections from "../../components/modules/TocSections";
import SectionList from "../../components/modules/SectionList";
import ChapterTitle from "../../components/modules/ChapterTitle";
import RulesetForm from "../../components/modules/RulesetForm";
import SearchForm from "../../components/modules/SearchForm";
import CustomErrors from "../../components/modules/CustomErrors";
import { Nodes, Chapter } from "../../../app/types";
import styles from "../../../styles/[version].module.scss";

interface Props {
  nodes: Nodes;
}

export const getStaticProps: getStaticProps = async ({ params }): Promise<void | Nodes> => {
  // Fetch rule set
  const url = `https://media.wizards.com/${params.year}/downloads/MagicCompRules%${params.version}.txt`;
  const res: string = await fetch(url);
  const rawRuleSetText: string = await res.text();
  // Parse rules text to an array of rule nodes
  const nodes: Nodes = await rulesParse(rawRuleSetText);

  const result = (nodes)
    ? {
      props: { nodes },
      revalidate: 1,
    }
    : {
      props: {},
      notFound: true,
    };

  return result;
};

export const getStaticPaths: getStaticPaths = async () => {
  const values = [["2021", "2020210419"]];
  const paths = values.map((value) => ({
    params: { year: value[0], version: value[1] },
  }));
  return { paths, fallback: true };
  // return { paths, fallback: "blocking" };
};

const RuleSetPage = (props: Props): JSX.Element => {
  const { nodes } = props;
  const [errorData, setErrorData] = useState({
    nodes: [],
    validChapter: true,
  });

  const router = useRouter();

  // Determine Rulelist chapter title from ToC anchor or scrolling
  const [refRuleArray, setRefRuleArray] = useState([]);
  const [refTocArray, setRefTocArray] = useState([]);
  const [pause, setPause] = useState(false);
  const [chapterValues, setChapterValues] = useState({});

  // Collect and sort rule set categories into node arrays
  const sections = sortBy(
    nodes.filter((node) => node.type === "section"),
    ["sectionNumber"],
  );
  const chapters = sortBy(
    nodes.filter((node) => node.type === "chapter"),
    ["sectionNumber", "chapterNumber"],
  );
  const rules = nodes.filter((node) => node.type === "rule");
  const subrules = nodes.filter((node) => node.type === "subrule");

  // Initialize chapterValue state
  useEffect(() => {
    // Get anchor value from url hash via router
    const anchorValue = Number(router.asPath.split("#")[1]);

    setChapterValues((prevValue) => ({
      ...prevValue,
      chapterNumber: anchorValue,
      anchorValue,
      hiddenAnchor: anchorValue,
      init: anchorValue,
      source: "init",
    }));
  }, [router.asPath]);

  // Error Detection: Add nodes array to errorData
  useEffect(() => {
    // errorData.nodes = nodes;
    if (!errorData.nodes.length) {
      setErrorData((prevValue) => ({
        ...prevValue,
        nodes,
      }));
    }
  }, [nodes, errorData.nodes.length]);

  // Error Detection: Add anchorValue to errorData
  useEffect(() => {
    // Confirm anchor value is found in chapters array
    const validateChapter = (chapterN: number): Chapter | undefined => chapters
      .find((chapter) => chapter.chapterNumber === chapterN);
    setErrorData((prevValue) => ({
      ...prevValue,
      validChapter: validateChapter(chapterValues.anchorValue),
    }));
  // eslint complains chapters not included, but need this set only once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterValues.anchorValue]);

  // SectionList viewport ref
  const rootRef = useRef<HTMLDivElement>();

  // SectionList rootRef.current, observed element
  const root: RefObject<HTMLDivElement> = rootRef.current || null;

  // Callback to collect an array of rule div refs to observe
  const setRuleRefs = useCallback(
    (node) => {
      if (node && !refRuleArray.includes(node)) {
        setRefRuleArray((oldArray) => [...oldArray, node]);
      }
    },
    [refRuleArray],
  );

  // Callback to collect an array of toc chapterTitle div refs to scroll to
  const setTocRefs = useCallback(
    (node) => {
      if (node && !refTocArray.includes(node)) {
        setRefTocArray((oldArray) => [...oldArray, node]);
      }
    },
    [refTocArray],
  );

  /*
    When a toc link is clicked, chapterTitle returns a chapterNumber via a prop.
    This value is overriden by the callback on render, unless the update is
    paused, callback chapterNumber saved to state, and a condition prevents the
    callback chapterNumber from being saved to state.
  */

  // Apply pause
  useEffect(() => {
    if (pause) {
      setTimeout(() => {
        setPause(!pause);
      }, 1500);
    }
  }, [pause]);

  // Callback that observes rule divs for intersection with the top of viewport
  const chapterNumber = useTopRule(refRuleArray, root) || chapterValues.init;

  let callbackNumber: number;

  if (!pause && chapterNumber) {
    callbackNumber = chapterNumber;
  }

  // ToC chapter title click prop
  const tocOnClick = (chapterN: number): number => {
    let source: string;
    // Initiate a pause as chapterNumber is supplied by prop
    setPause(true);
    const cValue = chapterValues.chapterNumber;
    if (cValue && chapterN < cValue) {
      source = "prop decrease";
    } else if (cValue && chapterN > cValue) {
      source = "prop increase";
    }

    // Save values
    if (chapterValues.chapterNumber !== chapterN) {
      setChapterValues((prevValue) => ({
        ...prevValue,
        currentCallback: callbackNumber,
        chapterNumber: chapterN,
        source,
        hiddenAnchor: chapterN,
        propValue: chapterN,
      }));
    }
  };

  /*
    Update ChapterTitle # if:
      - callbackNumber has value
      - Updates are not paused after a change from toc prop
      - Current chapterNumber is different from # returned by callback
      - Callback # saved during pause is different from the latest callback #
  */

  // Scroll the ToC list to the anchor tag chapter title
  useEffect(() => {
    if (chapterValues.source === "anchor tag"
      && errorData.nodes.length
      && errorData.validChapter
    ) {
      /*
        When page loads and there is an anchor, there is no observer callback and
        router does not register the url change, so get val from
        window.location.hash. Then update chapterNumber state.
      */
      const c = Number(window.location.hash.substr(1, 3));
      if (c) {
        setChapterValues((prevValue) => ({
          ...prevValue,
          chapterNumber: c,
          source: "anchor tag set",
          hiddenAnchor: c,
        }));
      }
      // Scroll ToC viewport to anchor tag's chapter title
      const re = new RegExp(`(${chapterValues.chapterNumber})`);
      const element = refTocArray.find((elem) => re.test(elem.outerText));
      element.scrollIntoView();
    }
  }, [refTocArray, chapterValues.source, chapterValues.chapterNumber, errorData]);

  useEffect(() => {
    const anchorNumber = chapterValues.anchorValue;
    if (
      anchorNumber
      && anchorNumber !== chapterValues.hiddenAnchor
      && anchorNumber !== chapterValues.chapterNumber
      && chapterValues.source === "init"
    ) {
      setChapterValues((prevValue) => ({
        ...prevValue,
        chapterNumber: anchorNumber,
        source: "anchor tag",
        hiddenAnchor: anchorNumber,
      }));
    } else if (callbackNumber
      && !pause
      && chapterValues.chapterNumber !== callbackNumber
      && chapterValues.currentCallback !== callbackNumber
    ) {
      let c: number;
      const { source, propValue } = chapterValues;
      const updateState = (n: number): void => {
        setChapterValues((prevValue) => ({
          ...prevValue,
          source: "callback",
          chapterNumber: n,
          currentCallback: n,
          hiddenAnchor: n,
        }));
      };
      if (source === "prop decrease") {
        /*
          When the prop returns a # less than the state chapterNumber, the observer
          callback returns the wrong value. In this case use propValue instead.
        */
        c = propValue;
        if (c) {
          updateState(c);
        }
      } else {
        // callbackNumber is correct, so use it
        c = callbackNumber;
        if (c && c !== chapterValues.chapterNumber) {
          updateState(c);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, callbackNumber, pause]);

  // Display a fallback page if waiting to transition to another page
  if (router.isFallback) {
    return (
      <div className={styles.spinnerDiv}>
        <Spinner
          animation="border"
          role="status"
          variant="dark"
          className={styles.spinnerComponent}
        >
          <span className={styles.loadingText}>Loading...</span>
        </Spinner>
      </div>
    );
  }

  const errorResult = (obj): number => Object.values(obj).every(Boolean);

  return (
    <div>
      { (!errorResult(errorData))
        ? (<div>
          <CustomErrors data={errorData} chapterNumber={chapterValues.chapterNumber} />
        </div>
        ) : (
      <div className={styles.bodyContainer}>
        <div className={styles.leftContainer}>
          <TocSections
            sections={sections}
            chapters={chapters}
            tocOnClick={tocOnClick}
            tocTitleRef={setTocRefs}
          />
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.rightRelative}>
            <div className={styles.tabsContainer}>
              <Tabs defaultActiveKey="search">
                <Tab eventKey="search" title="Search Ruleset">
                  <div>
                    <SearchForm />
                  </div>
                </Tab>
                <Tab eventKey="ruleset" title="Load Another Ruleset">
                  <RulesetForm
                    smallText="Change and submit a link to view a different ruleset."
                  />
                </Tab>
              </Tabs>
            </div>
            <div className={styles.chapterTitleContainer}>
              <ChapterTitle chapter={chapters.find((chapter) => chapter
                .chapterNumber === chapterValues.chapterNumber)} toc={0} />
            </div>
            <div className={styles.rulesContainer}>
              <SectionList
                sections={sections}
                chapters={chapters}
                rules={rules}
                subrules={subrules}
                elRef={setRuleRefs}
                root={rootRef}
              />
            </div>
          </div>
        </div>
      </div>
        )}
    </div>
  );
};

export default RuleSetPage;
