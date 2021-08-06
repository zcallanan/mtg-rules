import React, { useState, useRef, useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import parseNodes from "../../../app/utils/parse-nodes";
import TocSections from "../../../app/components/TocSections";
import RulePane from "../../../app/components/RulePane";
import RuleChapterPane from "../../../app/components/RuleChapterPane";
import CustomErrors from "../../../app/components/CustomErrors";
import TopRuleWrapper from "../../../app/components/TopRuleWrapper";
import SearchWrapper from "../../../app/components/SearchWrapper";
import ScrollTocWrapper from "../../../app/components/ScrollTocWrapper";
import Overview from "../../../app/components/Overview";
import TabContent from "../../../app/components/TabContent";
import objectArrayComparison from "../../../app/utils/object-array-comparison";
import {
  ChapterValues,
  Section,
  Chapter,
  Rule,
  Subrule,
  GetStaticPropsResult,
  ValidateChapter,
  DynamicProps,
  RulesParse,
  GetStaticPropsParams,
  GetStaticPathsResult,
  SearchData,
  SearchResults,
} from "../../../app/typing/types";
import styles from "../../../app/styles/[version].module.scss";

export const getStaticProps = async (
  context: GetStaticPropsParams
): Promise<GetStaticPropsResult> => {
  const { year, version } = context.params;
  // Fetch rule set
  const url = `https://media.wizards.com/${year}/downloads/MagicCompRules%${version}.txt`;
  const res = await fetch(url);
  const rawRuleSetText: string = await res.text();
  // Parse rules text to an array of rule nodes
  const nodes: RulesParse = await parseNodes(rawRuleSetText);

  // Parse rules text for effective date
  const effectiveDateRegex =
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{2}),\s+(\d{4})/gm;
  let effectiveDate: string;
  if (effectiveDateRegex.test(rawRuleSetText)) {
    [effectiveDate] = rawRuleSetText.match(effectiveDateRegex);
  }

  const result: GetStaticPropsResult = nodes
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

export const getStaticPaths = async (): Promise<GetStaticPathsResult> => {
  const values = [["2021", "2020210419"]];
  const paths = values.map((value) => ({
    params: { year: value[0], version: value[1] },
  }));
  return { paths, fallback: true };
  // return { paths, fallback: "blocking" };
};

const RuleSetPage = (props: DynamicProps): JSX.Element => {
  const { nodes, effectiveDate } = props;
  const [errorData, setErrorData] = useState<ValidateChapter>({
    nodes: {
      sections: [],
      chapters: [],
      rules: [],
      subrules: [],
    },
    validChapter: true,
  });

  const router: NextRouter = useRouter();
  const path = router.asPath.split("#");

  const [rulesInUse, setRulesInUse] = useState<Rule[]>([]);
  const [chaptersInUse, setChaptersInUse] = useState<Chapter[]>([]);
  const [scrollToc, setScrollToc] = useState<number>(0);
  const [searchData, setSearchData] = useState<SearchData>({
    searchTerm: "",
    searchType: "partial",
    searchCompleted: 0,
    sections: [],
    chapters: [],
    rules: [],
    subrules: [],
  });
  const [searchResults, setSearchResults] = useState<SearchResults>({
    searchTerm: "",
    searchType: "",
    searchSections: [],
    searchChapters: [],
    searchRules: [],
    searchSubrules: [],
    searchResult: 1,
  });
  const [callbackChapterNumber, setCallbackValue] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);
  const [chapterValues, setChapterValues] = useState<ChapterValues>({
    currentCallback: 0,
    chapterNumber: 0,
    anchorValue: 0,
    init: 0,
    source: "",
    propValue: 0,
  });
  const [sections, setSections] = useState<Section[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [subrules, setSubrules] = useState<Subrule[]>([]);

  // Save parsed node data to state at init or when a node array changes
  useEffect(() => {
    if (nodes) {
      console.log(nodes);
      if (
        (nodes.sections && nodes.sections.length && !sections.length) ||
        nodes.sections !== sections
      ) {
        setSections(nodes.sections);
      }
      if (
        (nodes.chapters && nodes.chapters.length && !chapters.length) ||
        nodes.chapters !== chapters
      ) {
        setChapters(nodes.chapters);
      }
      if (
        (nodes.rules && nodes.rules.length && !rules.length) ||
        nodes.rules !== rules
      ) {
        setRules(nodes.rules);
      }
      if (
        (nodes.subrules && nodes.subrules.length && !subrules.length) ||
        nodes.subrules !== subrules
      ) {
        setSubrules(nodes.subrules);
      }
    }
  }, [
    nodes,
    sections.length,
    chapters.length,
    rules.length,
    subrules.length,
    sections,
    chapters,
    rules,
    subrules,
  ]);

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
    if (nodes && nodes.chapters && nodes.chapters.length) {
      setErrorData((prevValue) => ({
        ...prevValue,
        nodes,
      }));
    }
  }, [nodes]);

  // Error Detection: Add anchorValue to errorData
  useEffect(() => {
    // Confirm anchor value is found in chapters array
    const validateChapter = (chapterN: number): Chapter | undefined =>
      chapters.find((chapter) => chapter.chapterNumber === chapterN);

    if (chapterValues.anchorValue && chapters.length) {
      setErrorData((prevValue: ValidateChapter) => ({
        ...prevValue,
        validChapter: validateChapter(chapterValues.anchorValue),
      }));
    }
    // eslint complains chapters not included, but need this set only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterValues.anchorValue]);

  // Root refs
  const rightViewportRef = useRef<HTMLDivElement>();
  const leftViewportRef = useRef<HTMLDivElement>();

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

  // Track what rules are rendered
  useEffect(() => {
    // Either the search result else default
    const result = searchResults.searchRules.length
      ? searchResults.searchRules
      : rules;
    // Save the rules in use to state
    if (!objectArrayComparison(result, rulesInUse)) {
      setRulesInUse(result);
    }
  }, [rules, rulesInUse, searchResults.searchRules]);

  // Collect mutable refs in [] for useTopRule to iterate over and observe
  const rulesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Adjust the size of rulesRef to trigger observation of rules by useTopRule
    if (rulesInUse.length) {
      rulesRef.current = rulesRef.current.slice(0, rulesInUse.length);
    }
  }, [rulesInUse]);

  let callbackNumber: number;

  if (!pause && callbackChapterNumber) {
    callbackNumber = callbackChapterNumber;
  }

  // Collect mutable refs in [] for toc scrolling
  const tocRefs = useRef<HTMLDivElement[]>([]);

  // Track what chapters are rendered
  useEffect(() => {
    // Either the search result else default
    const result = searchResults.searchChapters.length
      ? searchResults.searchChapters
      : chapters;
    // Save the rules in use to state
    if (!objectArrayComparison(result, chaptersInUse)) {
      setChaptersInUse(result);
    }
  }, [chapters, chaptersInUse, searchResults.searchChapters]);

  useEffect(() => {
    // Adjust the size of chaptersInUse
    if (chaptersInUse.length) {
      tocRefs.current = tocRefs.current.slice(0, chaptersInUse.length);
    }
  }, [chaptersInUse]);

  // Prop used by TopRuleWrapper to save useTopRule callback value
  const topRuleProp = (chapterN: number): void => {
    if (chapterN >= 100 && callbackChapterNumber !== chapterN) {
      // Delay to prevent TopRuleWrapper updating dynamic page while rendering
      setTimeout(() => setCallbackValue(chapterN), 200);
    }
  };

  // Prop used by ToC links and rule & subrule viewport links
  const onLinkClick = (chapterN: number, dataSource: string): void => {
    // If chapterN comes from a sectionList viewport link, scroll Toc
    if (dataSource === "rules" && chapterN) {
      setScrollToc(chapterN);
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
      anchorNumber &&
      chapterValues.source === "init" &&
      tocRefs.current.length &&
      chapters.length
    ) {
      setChapterValues((prevValue) => ({
        ...prevValue,
        chapterNumber: anchorNumber,
        source: "anchor tag",
      }));

      // Scroll ToC viewport to anchor tag's chapter title
      setScrollToc(chapterValues.chapterNumber);
    } else if (
      callbackNumber &&
      !pause &&
      chapterValues.chapterNumber !== callbackNumber &&
      chapterValues.currentCallback !== callbackNumber
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

      if (
        (source === "prop decrease" || source === "prop increase") &&
        propValue
      ) {
        updateState(propValue);
      } else if (
        callbackNumber &&
        callbackNumber !== chapterValues.chapterNumber
      ) {
        updateState(callbackNumber);
      }
    }
    // Eslint complains of missing dependencies that are unnecessary here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, callbackNumber, pause]);

  // Check if there is an error on the page
  const errorResult = (obj: ValidateChapter): boolean =>
    Object.values(obj).every(Boolean);

  // Display a fallback page if waiting to transition to another page
  if (router.isFallback) {
    return (
      <div className={styles.spinnerDiv}>
        <Spinner
          animation="border"
          role="status"
          variant="dark"
          className={styles.spinnerComponent}
        ></Spinner>
      </div>
    );
  }

  return (
    <div>
      {scrollToc && (
        <ScrollTocWrapper
          setScrollToc={setScrollToc}
          scrollToc={scrollToc}
          tocRefs={tocRefs}
        />
      )}
      {!searchData.searchCompleted && searchData.searchTerm && (
        <SearchWrapper
          setSearchData={setSearchData}
          setSearchResults={setSearchResults}
          previousSearchResults={searchResults}
          searchData={searchData}
        />
      )}
      {rightViewportRef && (
        <TopRuleWrapper
          rootRef={rightViewportRef}
          topRuleProp={topRuleProp}
          rulesRef={rulesRef}
          init={chapterValues.init}
          rulesInUse={rulesInUse}
        />
      )}
      {!errorResult(errorData) ? (
        <div>
          <CustomErrors
            data={errorData}
            chapterNumber={chapterValues.chapterNumber}
          />
        </div>
      ) : (
        <div className={styles.bodyContainer}>
          <div className={styles.leftContainer} ref={leftViewportRef}>
            {leftViewportRef && (
              <TocSections
                searchResults={searchResults}
                leftViewportRef={leftViewportRef}
                sections={
                  searchResults.searchSections.length
                    ? searchResults.searchSections
                    : sections
                }
                chapters={
                  searchResults.searchChapters.length
                    ? searchResults.searchChapters
                    : chapters
                }
                onLinkClick={onLinkClick}
                tocTitleRef={tocRefs}
              />
            )}
          </div>
          <div className={styles.rightContainer}>
            <TabContent
              searchResults={searchResults}
              sections={sections}
              chapters={chapters}
              rules={rules}
              subrules={subrules}
              setSearchData={setSearchData}
              setSearchResults={setSearchResults}
            />
            <Overview
              nodes={nodes}
              searchData={searchData}
              searchResults={searchResults}
              effectiveDate={effectiveDate}
            />
            <RuleChapterPane
              searchData={searchData}
              searchResults={searchResults}
              chapters={chapters}
              chapterValues={chapterValues}
              sections={sections}
            />
            <RulePane
              searchData={searchData}
              searchResults={searchResults}
              sections={sections}
              chapters={chapters}
              rules={rules}
              subrules={subrules}
              rulesRef={rulesRef}
              rightViewportRef={rightViewportRef}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleSetPage;
