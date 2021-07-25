import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  RefObject,
} from "react";
import { Node } from "simple-text-parser";
import sortBy from "lodash/sortBy";
import { useRouter, NextRouter } from "next/router";
import { Spinner, Tabs, Tab } from "react-bootstrap";
import rulesParse from "../../../app/rules-parse";
import useTopRule from "../../components/modules/useTopRule";
import TocSections from "../../components/modules/TocSections";
import SectionList from "../../components/modules/SectionList";
import ChapterTitle from "../../components/modules/ChapterTitle";
import RulesetForm from "../../components/modules/RulesetForm";
import SearchForm from "../../components/modules/SearchForm";
import CustomErrors from "../../components/modules/CustomErrors";
import {
  Nodes,
  ChapterValues,
  Section,
  Chapter,
  Rule,
  Subrule,
  GetStaticPropsResult,
  ValidateChapter,
} from "../../../app/types";
import styles from "../../../styles/[version].module.scss";

export const getStaticProps = async ({ params }): Promise<GetStaticPropsResult> => {
  // Fetch rule set
  const url = `https://media.wizards.com/${params.year}/downloads/MagicCompRules%${params.version}.txt`;
  const res = await fetch(url);
  const rawRuleSetText: string = await res.text();
  // Parse rules text to an array of rule nodes
  const nodes: Node[] = await rulesParse(rawRuleSetText);

  // Parse rules text for effective date
  const effectiveDateRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{2}),\s+(\d{4})/gm;
  let effectiveDate: string;
  if (effectiveDateRegex.test(rawRuleSetText)) {
    [effectiveDate] = rawRuleSetText.match(effectiveDateRegex);
  }

  const result: GetStaticPropsResult = (nodes)
    ? {
      props: { nodes, effectiveDate },
      revalidate: 1,
    }
    : {
      props: {},
      notFound: true,
    };
  return result;
};

export const getStaticPaths = async () => {
  const values = [["2021", "2020210419"]];
  const paths = values.map((value) => ({
    params: { year: value[0], version: value[1] },
  }));
  return { paths, fallback: true };
  // return { paths, fallback: "blocking" };
};

const RuleSetPage = (props: Props): JSX.Element => {
  const { nodes, effectiveDate } = props;
  const array: (Section | Chapter | Rule | Subrule)[] = [];
  const [errorData, setErrorData] = useState<ValidateChapter>({
    nodes: array,
    validChapter: true,
  });

  const router: NextRouter = useRouter();
  const path = router.asPath.split("#");

  const [refRuleArray, setRefRuleArray] = useState<RefObject<HTMLDivElement>[]>([]);
  const [refTocArray, setRefTocArray] = useState<RefObject<HTMLDivElement>[]>([]);
  const [pause, setPause] = useState<boolean>(false);
  const [chapterValues, setChapterValues] = useState<ChapterValues>({});
  const [sections, setSections] = useState<Section[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [subrules, setSubrules] = useState<Subrule[]>([]);

  // Collect and sort rule set categories into node arrays
  if (nodes && nodes.length
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
    if (!chapterValues.anchorValue && path[1]) {
      // Hash can refer to rule or subrule, so isolate chapter digits
      const [anchorChapter] = path[1].match(/\d{3}/);
      const anchorValue = Number(anchorChapter);

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
    if (nodes && nodes.length) {
      setErrorData((prevValue) => ({
        ...prevValue,
        nodes,
      }));
    }
  }, [nodes]);

  // Error Detection: Add anchorValue to errorData
  useEffect(() => {
    // Confirm anchor value is found in chapters array
    const validateChapter = (chapterN: number): Chapter | undefined => chapters
      .find((chapter) => chapter.chapterNumber === chapterN);

    if (chapterValues.anchorValue && chapters.length) {
      setErrorData((prevValue: ValidateChapter) => ({
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
  const root: HTMLDivElement = rootRef.current;

  // Callback to collect an array of rule div refs to observe
  const setRuleRefs = useCallback(
    (node: RefObject<HTMLDivElement>) => {
      if (node && !refRuleArray.includes(node)) {
        setRefRuleArray((oldArray) => [...oldArray, node]);
      }
    },
    [refRuleArray],
  );

  // Callback to collect an array of toc chapterTitle div refs to scroll to
  const setTocRefs = useCallback(
    (node: RefObject<HTMLDivElement>) => {
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
  const callbackChapterNumber = useTopRule(refRuleArray, rootRef) || chapterValues.init;

  let callbackNumber: number;

  if (!pause && callbackChapterNumber) {
    callbackNumber = callbackChapterNumber;
  }

  // Scroll ToC to chapterTitle corresponding to url hash value
  const scrollToc = (chapterNumber: number) => {
    const re = new RegExp(`(${chapterNumber})`);
    const element = refTocArray.find((elem) => re.test(elem.outerText));
    element.scrollIntoView();
  };

  // Prop used by ToC links and section list viewport links
  const onLinkClick = (chapterN: number, dataSource: string): void => {
    // If chapterN comes from a sectionList viewport link, scroll Toc
    if (dataSource === "rules") {
      scrollToc(chapterN);
    }

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
      scrollToc(chapterValues.chapterNumber);
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

  const errorResult = (obj: ValidateChapter ): boolean => Object.values(obj).every(Boolean);

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
            onLinkClick={onLinkClick}
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
              <ChapterTitle
                chapter={chapters.find((chapter) => chapter
                  .chapterNumber === chapterValues.chapterNumber)}
                toc={0}
                effectiveDate={effectiveDate}
                sections={sections}
              />
            </div>
            <div className={styles.rulesContainer}>
              <SectionList
                sections={sections}
                chapters={chapters}
                rules={rules}
                subrules={subrules}
                elRef={setRuleRefs}
                root={rootRef}
                onLinkClick={onLinkClick}
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
