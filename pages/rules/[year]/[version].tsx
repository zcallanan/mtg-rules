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
  const path = router.asPath.split("#");

  // Determine Rulelist chapter title from ToC anchor or scrolling
  const [refRuleArray, setRefRuleArray] = useState([]);
  const [refTocArray, setRefTocArray] = useState([]);
  const [pause, setPause] = useState(false);
  const [chapterValues, setChapterValues] = useState({});
  const [sections, setSections] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [rules, setRules] = useState([]);
  const [subrules, setSubrules] = useState([]);

  useEffect(() => {
    console.log("path is", path.length)
    if (path.length === 1) {
      router.push("#100", undefined, { shallow: true });
    }
  }, [router, path]);

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

  // Initialize chapterValue state
  useEffect(() => {
    // Get anchor value from url hash via router
    console.log("path", path)
    if (!chapterValues.anchorValue) {
      console.log("init anchorValue")
      const anchorValue = Number(path[1]);
      console.log("anchorValue is", anchorValue)

      setChapterValues((prevValue) => ({
        ...prevValue,
        currentCallback: 100,
        chapterNumber: anchorValue,
        anchorValue,
        hiddenAnchor: anchorValue,
        init: anchorValue,
        source: "init",
      }));
    }
  }, [path, chapterValues.anchorValue]);

  // Error Detection: Add nodes array to errorData
  useEffect(() => {
    // errorData.nodes = nodes;
    if (!errorData.nodes.length) {
      console.log("setNodes")
      setErrorData((prevValue) => ({
        ...prevValue,
        nodes,
      }));
    }
  }, [nodes, errorData.nodes.length]);

  // Error Detection: Add anchorValue to errorData
  useEffect(() => {
    // Confirm anchor value is found in chapters array
    const validateChapter = (chapterN: number): Chapter | undefined => {
      console.log("chapter:", chapterN)
      return chapters.find((chapter) => chapter.chapterNumber === chapterN);
    };
    if (chapterValues.anchorValue) {
      console.log("setValidChapter")
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
        console.log("setRuleArray")
        setRefRuleArray((oldArray) => [...oldArray, node]);
      }
    },
    [refRuleArray],
  );

  // Callback to collect an array of toc chapterTitle div refs to scroll to
  const setTocRefs = useCallback(
    (node) => {
      if (node && !refTocArray.includes(node)) {
        console.log("setToC")
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
      console.log("setPause")
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
      console.log("toc")
      setChapterValues((prevValue) => ({
        ...prevValue,
        // currentCallback: chapterN,
        chapterNumber: chapterN,
        anchorValue: chapterN,
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
  // useEffect(() => {
  //   console.log(chapterValues.source)
  //   if (
  //     errorData.nodes.length
  //     && errorData.validChapter
  //   ) {
  //     /*
  //       When page loads and there is an anchor, there is no observer callback and
  //       router does not register the url change, so get val from
  //       window.location.hash. Then update chapterNumber state.
  //     */
  //     const c = Number(window.location.hash.substr(1, 3));
  //     console.log("hash", c)
  //     if (c) {
  //       console.log("anchor tag set")
  //       setChapterValues((prevValue) => ({
  //         ...prevValue,
  //         chapterNumber: c,
  //         source: "anchor tag set",
  //         hiddenAnchor: c,
  //       }));
  //     }
  //     // Scroll ToC viewport to anchor tag's chapter title
  //     const re = new RegExp(`(${chapterValues.chapterNumber})`);
  //     const element = refTocArray.find((elem) => re.test(elem.outerText));
  //     element.scrollIntoView();
  //   }
  // }, [refTocArray, chapterValues.source, chapterValues.chapterNumber, errorData]);

  useEffect(() => {
    const anchorNumber = chapterValues.anchorValue;
    console.log("anc", anchorNumber, chapterValues)
    if (
      anchorNumber
      && chapterValues.source === "init"
      && refTocArray.length
      && chapters.length
    ) {
      console.log("callback anchor")
      setChapterValues((prevValue) => ({
        ...prevValue,
        chapterNumber: anchorNumber,
        source: "anchor tag",
        hiddenAnchor: anchorNumber,
      }));

      // Scroll ToC viewport to anchor tag's chapter title
      const re = new RegExp(`(${chapterValues.chapterNumber})`);
      const element = refTocArray.find((elem) => re.test(elem.outerText));
      console.log(element)
      element.scrollIntoView();
    } else if (callbackNumber
      && !pause
      && chapterValues.chapterNumber !== callbackNumber
      && chapterValues.currentCallback !== callbackNumber
    ) {
      let c: number;
      const { source, propValue } = chapterValues;
      const updateState = (n: number): void => {
        console.log("updateState")
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

  const errorResult = (obj): number => {
    const result = Object.values(obj).every(Boolean);
    console.log("errorResult:", result, obj)
    return result
  }

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
