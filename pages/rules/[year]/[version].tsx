import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import uniqBy from "lodash/uniqBy";
import { useRouter, NextRouter } from "next/router";
import { Spinner, Tabs, Tab } from "react-bootstrap";
import rulesParse from "../../../app/utils/rules-parse";
import TocSections from "../../../app/components/TocSections";
import SectionList from "../../../app/components/SectionList";
import ChapterTitle from "../../../app/components/ChapterTitle";
import RulesetForm from "../../../app/components/RulesetForm";
import SearchForm from "../../../app/components/SearchForm";
import CustomErrors from "../../../app/components/CustomErrors";
import CallbackWrapper from "../../../app/components/CallbackWrapper";
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
  SearchValue,
  SearchResults,
  RulesResult,
} from "../../../app/typing/types";
import styles from "../../../app/styles/[version].module.scss";

export const getStaticProps = async (
  context: GetStaticPropsParams,
): Promise<GetStaticPropsResult> => {
  const { year, version } = context.params;
  // Fetch rule set
  const url = `https://media.wizards.com/${year}/downloads/MagicCompRules%${version}.txt`;
  const res = await fetch(url);
  const rawRuleSetText: string = await res.text();
  // Parse rules text to an array of rule nodes
  const nodes: RulesParse = await rulesParse(rawRuleSetText);

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

  const [searchResults, setSearchResults] = useState<SearchResults>({
    searchTerm: "",
    searchSections: [],
    searchChapters: [],
    searchRules: [],
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

  // Save parsed node data to state
  if (nodes) {
    if (nodes.sections && nodes.sections.length && !sections.length) {
      setSections(nodes.sections);
    }
    if (nodes.chapters && nodes.chapters.length && !chapters.length) {
      setChapters(nodes.chapters);
    }
    if (nodes.rules && nodes.rules.length && !rules.length) {
      setRules(nodes.rules);
    }
    if (nodes.subrules && nodes.subrules.length && !subrules.length) {
      setSubrules(nodes.subrules);
    }
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

  // Collect mutable refs in [] for useTopRule to iterate over and observe
  const rulesRef = useRef<HTMLDivElement[]>([]);

  let callbackNumber: number;

  if (!pause && callbackChapterNumber) {
    callbackNumber = callbackChapterNumber;
  }

  // Collect mutable refs in [] for toc scrolling
  const tocRefs = useRef<HTMLDivElement[]>([]);

  // Scroll ToC to chapterTitle corresponding to url hash value
  const scrollToc = (chapterNumber: number) => {
    const re = new RegExp(`(${chapterNumber})`);
    const element = tocRefs.current.find((elem) => re.test(elem.innerText));
    element.scrollIntoView();
  };

  // Prop for search
  const onSearch = (searchValue: SearchValue) => {
    if (searchValue.reset || (!searchValue.searchTerm && searchResults.searchTerm)) {
      // If search form cancel button is clicked OR an empty form is submitted, reset values
      setSearchResults((prevValue) => ({
        ...prevValue,
        searchTerm: "",
        searchSections: [],
        searchChapters: [],
        searchRules: [],
      }));
    } else if (searchResults.searchTerm !== searchValue.searchTerm) {
      // If searchTerm changed, save searchTerm to state and reset rules array
      setSearchResults((prevValue) => ({
        ...prevValue,
        searchTerm: searchValue.searchTerm,
        searchSections: [],
        searchChapters: [],
        searchRules: [],
      }));

      /* 
        - Filter rules and subrules node arrays
        - Subrules & example text are not displayed without context of what rule it belongs to,
          whether rule has the searchTerm or not
        - If a subrule &/or exampleText has a match, and its rule text does not, then that rule should be included
          in searchResults rules array
      */

      // Create regex
      const termRegex = new RegExp(searchValue.searchTerm, "gim");

      // Checks whether a rule or subrule's exampleArray contains searchTerm
      const checkExamples = (exampleArray: string[]): number => {
        const result = exampleArray.filter((exampleText) => termRegex.test(exampleText))
        return (result.length) ? 1 : 0;
      };

      // Get rule nodes subset where rule, child subrules, or child example text returns true for termRegex
      const testRules = (): RulesResult => {
        const subrulesResult = subrules.filter((subruleNode) => termRegex.test(subruleNode.text) || ((subruleNode.example.length) 
          ? checkExamples(subruleNode.example)
          : 0
        ))
        const subruleRules: number[][] = subrulesResult.map((subrule) => ([subrule.chapterNumber, subrule.ruleNumber]));

        /*
          1. Rule has searchTerm OR
          2. Rule's example text has searchTerm (checkExamples) OR
          3. Rule's subrule or subrule example text has searchTerm (subrulesRules)
        */

        const rulesResult = rules.filter((node) => termRegex.test(node.text) 
          || ((node.example.length) 
            ? checkExamples(node.example)
            : 0
          ) || (subruleRules.some((val) => val[0] === node.chapterNumber && val[1] === node.ruleNumber)
        ));

        const ruleValues = rulesResult.map((rule) => ([rule.sectionNumber, rule.chapterNumber]));
        const ruleSections = uniqBy(ruleValues
          .map((val) => sections
          .find((section) => section.sectionNumber === val[0])), "sectionNumber");
        const ruleChapters = uniqBy(ruleValues
          .map((val) => chapters
          .find((chapter) => chapter.chapterNumber === val[1])), "chapterNumber");
        return {
          searchSections: ruleSections,
          searchChapters: ruleChapters,
          searchRules: rulesResult,
        };
      };

      const results: RulesResult = testRules();
      
      setSearchResults((prevValue) => ({
        ...prevValue,
        searchSections: results.searchSections,
        searchChapters: results.searchChapters,
        searchRules: results.searchRules,
      }))
    }
  };

  // Prop used by CallbackWrapper to save useTopRule callback value
  const wrapperProp = (chapterN: number): void => {
    if (chapterN >= 100 && callbackChapterNumber !== chapterN) {
      // Delay to prevent CallbackWrapper updating dynamic page while rendering
      setTimeout(() => setCallbackValue(chapterN), 200);
    }
  }

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
      && tocRefs.current.length
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

  // Check if there is an error on the page
  const errorResult = (obj: ValidateChapter): boolean => Object.values(obj).every(Boolean);

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
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      {rootRef 
        && <CallbackWrapper 
          rootRef={rootRef}
          wrapperProp={wrapperProp}
          rulesRef={rulesRef}
          init={chapterValues.init}
        />}
      { (!errorResult(errorData))
        ? (<div>
          <CustomErrors data={errorData} chapterNumber={chapterValues.chapterNumber} />
        </div>
        ) : (
      <div className={styles.bodyContainer}>
        <div className={styles.leftContainer}>
          <TocSections
            sections={(searchResults.searchSections.length) ? searchResults.searchSections : sections}
            chapters={(searchResults.searchChapters.length) ? searchResults.searchChapters : chapters}
            onLinkClick={onLinkClick}
            tocTitleRef={tocRefs}
          />
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.rightRelative}>
            <div className={styles.tabsContainer}>
              <Tabs defaultActiveKey="search">
                <Tab eventKey="search" title="Search Ruleset">
                  <div>
                    <SearchForm onSearch={onSearch} searchedTerm={searchResults.searchTerm}/>
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
                rules={(searchResults.searchRules.length) ? searchResults.searchRules : rules}
                subrules={subrules}
                elRef={rulesRef}
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
