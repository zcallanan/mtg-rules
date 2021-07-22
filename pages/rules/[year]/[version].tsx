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
import { Nodes, Chapter, ChapterValues } from "../../../app/types";
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
  const path = router.asPath.split("#");

  // Determine Rulelist chapter title from ToC anchor or scrolling
  const [refRuleArray, setRefRuleArray] = useState([]);
  const [refTocArray, setRefTocArray] = useState([]);
  const [pause, setPause] = useState(false);
  const [chapterValues, setChapterValues] = useState<ChapterValues>({});
  const [sections, setSections] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [rules, setRules] = useState([]);
  const [subrules, setSubrules] = useState([]);

  // Collect and sort rule set categories into node arrays
  if (nodes.length
    && !sections.length
    && !chapters.length
    && !rules.length
    && !subrules.length
  ) {
    setSections(sortBy(
      nodes.filter((node) => node.type === "section"),
      ["sectionNumber"],
    ));
    setChapters(sortBy(
      nodes.filter((node) => node.type === "chapter"),
      ["sectionNumber", "chapterNumber"],
    ));
    setRules(nodes.filter((node) => node.type === "rule"));
    setSubrules(nodes.filter((node) => node.type === "subrule"));
  }

  // Add a hash to url if none provided
  useEffect(() => {
    if (path.length === 1) {
      router.push("#100", undefined, { shallow: true });
    }
  }, [router, path]);

  // Initialize chapterValue state
  useEffect(() => {
    // Get anchor value from url hash via router
    if (!chapterValues.anchorValue) {
      const anchorValue = Number(path[1]);

      setChapterValues((prevValue) => ({
        ...prevValue,
        currentCallback: 100,
        chapterNumber: anchorValue,
        anchorValue,
        init: anchorValue,
        source: "init",
      }));
    }
  }, [path, chapterValues.anchorValue]);

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

    if (chapterValues.anchorValue) {
      setErrorData((prevValue) => ({
        ...prevValue,
        validChapter: validateChapter(chapterValues.anchorValue),
      }));
    }
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
      }, 500);
    }
  }, [pause]);

  // Callback that observes rule divs for intersection with the top of viewport
  const callbackChapterNumber = useTopRule(refRuleArray, root) || chapterValues.init;

  let callbackNumber: number;

  if (!pause && callbackChapterNumber) {
    callbackNumber = callbackChapterNumber;
  }

  // ToC chapter title click prop
  const tocOnClick = (chapterN: number): number => {
    let source: string;
    // Initiate a pause as chapterNumber is supplied by prop
    setPause(true);
    const { chapterNumber } = chapterValues;
    if (chapterNumber && chapterN < chapterNumber) {
      source = "prop decrease";
    } else if (chapterNumber && chapterN > chapterNumber) {
      source = "prop increase";
    }

    // Save value from prop
    if (chapterValues.chapterNumber !== chapterN) {
      setChapterValues((prevValue) => ({
        ...prevValue,
        chapterNumber: chapterN,
        anchorValue: chapterN,
        source,
        propValue: chapterN,
      }));
    }
  };

  /*
    If at initialization, use hash value as anchor link, and scroll to that chapter
      in ToC list
    Else use propValue or callbackNumber
  */

  useEffect(() => {
    const anchorNumber = chapterValues.anchorValue;
    if (
      anchorNumber
      && chapterValues.source === "init"
      && refTocArray.length
      && chapters.length
    ) {
      setChapterValues((prevValue) => ({
        ...prevValue,
        chapterNumber: anchorNumber,
        source: "anchor tag",
      }));

      // Scroll ToC viewport to anchor tag's chapter title
      const re = new RegExp(`(${chapterValues.chapterNumber})`);
      const element = refTocArray.find((elem) => re.test(elem.outerText));
      element.scrollIntoView();
    } else if (callbackNumber
      && !pause
      && chapterValues.chapterNumber !== callbackNumber
      && chapterValues.currentCallback !== callbackNumber
    ) {
      const { source, propValue } = chapterValues;

      // Update chapterValues chapterNumber and currentCallback fn
      const updateState = (chapterN: number): void => {
        setChapterValues((prevValue) => ({
          ...prevValue,
          source: "callback",
          chapterNumber: chapterN,
          currentCallback: chapterN,
        }));
      };

      /*
        When the prop returns a # less than the state chapterNumber, the observer
          callback returns the wrong value.
        When the prop returns a # greater than the state chapterNumber, the observer
          does not return a value at all.
        In this case use propValue instead.
      */

      if ((source === "prop decrease" || source === "prop increase") && propValue) {
        updateState(propValue);
      } else if (callbackNumber && callbackNumber !== chapterValues.chapterNumber) {
        updateState(callbackNumber);
      }
    }
    // Eslint complains of missing dependencies that are unnecessary here
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
