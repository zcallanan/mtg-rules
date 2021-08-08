import React, { useState, useRef, useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import parseNodes from "../../../app/utils/parse-nodes";
import TocSections from "../../../app/components/TocSections";
import RulePane from "../../../app/components/RulePane";
import RuleChapterPane from "../../../app/components/RuleChapterPane";
import CustomErrors from "../../../app/components/CustomErrors";
import TitleChapterNumber from "../../../app/components/TitleChapterNumber";
import SearchWrapper from "../../../app/components/SearchWrapper";
import ChapterClicked from "../../../app/components/ChapterClicked";
import TocScroll from "../../../app/components/TocScroll";
import Overview from "../../../app/components/Overview";
import TabContent from "../../../app/components/TabContent";
import objectArrayComparison from "../../../app/utils/object-array-comparison";
import {
  ChapterValues,
  ClickData,
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
  ScrollRules,
} from "../../../app/typing/types";
import styles from "../../../app/styles/[version].module.scss";
import RuleScroll from "../../../app/components/RuleScroll";

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

  // Router
  const router: NextRouter = useRouter();
  const path = router.asPath.split("#");

  // State
  const [rulesInUse, setRulesInUse] = useState<Rule[]>([]);
  const [chaptersInUse, setChaptersInUse] = useState<Chapter[]>([]);
  const [scrollRules, setScrollRules] = useState<ScrollRules>({
    hash: "",
    previousSearchTerm: "",
    promptScrollToRule: 0,
    searchTerm: "",
  });
  const [hashString, setHashString] = useState<string>("");
  const [scrollToc, setScrollToc] = useState<number>(0);
  const [clickData, setClickData] = useState<ClickData>({
    chapterN: 0,
    dataSource: "",
  });
  const [searchData, setSearchData] = useState<SearchData>({
    searchTerm: "",
    searchType: "partial",
    searchCleared: 0,
    searchCompleted: 0,
    sections: [],
    chapters: [],
    previousSearchTerm: "",
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
  const [chapterValues, setChapterValues] = useState<ChapterValues>({
    ignoreCallbackNumber: 0,
    chapterNumber: 0,
    anchorValue: 0,
    source: "",
  });
  const [sections, setSections] = useState<Section[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [subrules, setSubrules] = useState<Subrule[]>([]);

  // Root refs
  const rightViewportRef = useRef<HTMLDivElement>();
  const leftViewportRef = useRef<HTMLDivElement>();

  // For useTopRule to iterate over and observe
  const rulesRef = useRef<HTMLDivElement[]>([]);

  // For toc scrolling
  const tocRefs = useRef<HTMLDivElement[]>([]);

  // For scrolling to a rule after load or search
  const ruleNumberRefs = useRef<HTMLSpanElement[]>([]);

  // Save url hash value as a string
  useEffect(() => {
    if (path[1] && hashString !== path[1]) {
      setHashString(path[1]);
    }
  }, [hashString, path]);

  // Save parsed node data to state at init or when a node array changes
  useEffect(() => {
    if (nodes) {
      if (nodes.sections.length !== sections.length) {
        setSections(nodes.sections);
      }
      if (nodes.chapters.length !== chapters.length) {
        setChapters(nodes.chapters);
      }
      if (nodes.rules.length !== rules.length) {
        setRules(nodes.rules);
      }
      if (nodes.subrules.length !== subrules.length) {
        setSubrules(nodes.subrules);
      }
    }
  }, [chapters.length, nodes, rules.length, sections.length, subrules.length]);

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

  // Adjust the size of rulesRef & ruleNumberRefs if rulesInUse changes its length
  useEffect(() => {
    if (rulesInUse.length) {
      rulesRef.current = rulesRef.current.slice(0, rulesInUse.length);
      ruleNumberRefs.current = ruleNumberRefs.current.slice(
        0,
        rulesInUse.length
      );
    }
  }, [rulesInUse]);

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

  // Adjust the size of chaptersInUse if chaptersInUse changes its length
  useEffect(() => {
    if (chaptersInUse.length) {
      tocRefs.current = tocRefs.current.slice(0, chaptersInUse.length);
    }
  }, [chaptersInUse]);

  // Prompt scrolling to a rule
  useEffect(() => {
    if (hashString !== scrollRules.hash) {
      // On load, scroll the rule viewport to the url hash value \d{3}.\d
      setScrollRules((prevValue) => ({
        ...prevValue,
        hash: hashString,
        promptScrollToRule: 1,
      }));
    } else if (
      searchData.previousSearchTerm !== scrollRules.previousSearchTerm
    ) {
      // If there is a previousSearchTerm after search cancellation, scroll to the first \d{3}.\d rule in rulesInUse
      setScrollRules((prevValue) => ({
        ...prevValue,
        previousSearchTerm: searchData.previousSearchTerm,
        promptScrollToRule: 1,
      }));
    } else if (
      searchResults.searchTerm !== scrollRules.searchTerm &&
      searchResults.searchTerm
    ) {
      // If there is a search result search term, scroll to the first \d{3}.\d rule in rulesInUse
      setScrollRules((prevValue) => ({
        ...prevValue,
        searchTerm: searchResults.searchTerm,
        promptScrollToRule: 1,
      }));
    }
  }, [
    hashString,
    scrollRules.hash,
    scrollRules.previousSearchTerm,
    scrollRules.searchTerm,
    searchData.previousSearchTerm,
    searchResults.searchTerm,
  ]);

  // Prop for toc chapter title & rule links. ChapterClicked component utilizes clickData
  const onLinkClick = (chapterN: number, dataSource: string): void => {
    if (chapterN !== clickData.chapterN) {
      setClickData({ chapterN, dataSource });
    }
  };

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
      {!!scrollToc && (
        <TocScroll
          setScrollToc={setScrollToc}
          scrollToc={scrollToc}
          tocRefs={tocRefs}
          chaptersInUse={chaptersInUse}
        />
      )}
      {!!scrollRules.promptScrollToRule && (
        <RuleScroll
          ruleNumberRefs={ruleNumberRefs}
          rulesInUse={rulesInUse}
          scrollRules={scrollRules}
          searchData={searchData}
          searchResults={searchResults}
          setScrollRules={setScrollRules}
        />
      )}
      {!!clickData && !!clickData.chapterN && (
        <ChapterClicked
          chapterValues={chapterValues}
          clickData={clickData}
          setChapterValues={setChapterValues}
          setClickedData={setClickData}
          setScrollToc={setScrollToc}
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
        <TitleChapterNumber
          chaptersInUse={chaptersInUse}
          chapterValues={chapterValues}
          rootRef={rightViewportRef}
          rulesRef={rulesRef}
          rulesInUse={rulesInUse}
          tocRefDivs={tocRefs.current}
          searchData={searchData}
          searchResults={searchResults}
          setChapterValues={setChapterValues}
          setScrollToc={setScrollToc}
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
              ruleNumberRefs={ruleNumberRefs}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleSetPage;
