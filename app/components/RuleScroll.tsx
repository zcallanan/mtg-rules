import {
  Dispatch,
  SetStateAction,
  MutableRefObject,
  useEffect,
  useState,
} from "react";
import { Rule, ScrollRules, SearchData, SearchResults } from "../typing/types";

interface Props {
  ruleNumberRefs: MutableRefObject<HTMLSpanElement[]>;
  rulesInUse: Rule[];
  scrollRules: ScrollRules;
  searchData: SearchData;
  searchResults: SearchResults;
  setScrollRules: Dispatch<SetStateAction<ScrollRules>>;
}

const RuleScroll = (props: Props): JSX.Element => {
  const {
    ruleNumberRefs,
    rulesInUse,
    scrollRules,
    searchData,
    searchResults,
    setScrollRules,
  } = props;

  const [localRules, setLocalRules] = useState<Rule[]>(null);

  // Save to local state to ensure updated rulesRef is evaluated
  useEffect(() => {
    if (localRules !== rulesInUse) {
      setLocalRules(rulesInUse);
    }
  }, [rulesInUse, localRules]);

  // Scroll to scrollRules.hash
  useEffect(() => {
    const re =
      searchData.searchCompleted &&
      searchResults.searchResult &&
      searchResults.searchRules.length
        ? /\d{3}\.\d{1}/
        : new RegExp(`(${scrollRules.hash})`);
    const element = ruleNumberRefs.current.find((elem) =>
      re.test(elem.innerText)
    );
    if (element) {
      element.scrollIntoView();
    }
  }, [
    ruleNumberRefs,
    scrollRules.hash,
    searchData.searchCompleted,
    searchResults.searchResult,
    searchResults.searchRules.length,
  ]);

  // Scrolling complete, set scrollRules.promptScrollToRule to evaluate false
  useEffect(() => {
    if (scrollRules) {
      setScrollRules((prevValue) => ({
        ...prevValue,
        promptScrollToRule: 0,
      }));
    }
  }, [scrollRules, setScrollRules]);

  return null;
};

export default RuleScroll;
