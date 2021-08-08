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
  const { hash, previousSearchTerm, searchTerm } = scrollRules;

  interface RuleData {
    rulesInUse: Rule[];
    ruleNumbers: HTMLSpanElement[];
  }

  const [localRuleData, setLocalRuleData] = useState<RuleData>({
    rulesInUse: [],
    ruleNumbers: [],
  });
  const [scrolled, setScrolled] = useState<number>(0);

  // Save to local state to ensure scrolling occurs after all elements are rendered
  useEffect(() => {
    if (
      localRuleData.rulesInUse !== rulesInUse ||
      localRuleData.ruleNumbers !== ruleNumberRefs.current
    ) {
      setLocalRuleData({
        rulesInUse,
        ruleNumbers: ruleNumberRefs.current,
      });
    }
  }, [
    localRuleData.ruleNumbers,
    localRuleData.rulesInUse,
    ruleNumberRefs,
    rulesInUse,
  ]);

  // Determine what rule to scroll to and perform the scroll
  useEffect(() => {
    // Check if local state is ready to use
    if (
      !localRuleData.ruleNumbers.includes(null) &&
      localRuleData.rulesInUse &&
      localRuleData.rulesInUse.length
    ) {
      let firstRule: string;
      // If there is a search or search cancelled, use the first rule in rulesInUse, else use the hash value
      if (
        (searchTerm && searchTerm === searchResults.searchTerm) ||
        (previousSearchTerm &&
          previousSearchTerm === searchData.previousSearchTerm)
      ) {
        firstRule = `${localRuleData.rulesInUse[0].chapterNumber}.${localRuleData.rulesInUse[0].ruleNumber}`;
      }

      // Determine the regex string to find the right element
      const re = firstRule
        ? new RegExp(`(${firstRule})`)
        : new RegExp(`(${hash})`);

      // Find the element to scroll to
      const element = localRuleData.ruleNumbers.find((elem) =>
        re.test(elem.innerText)
      );

      // Perform the scroll
      if (element) {
        element.scrollIntoView();
        setScrolled(1);
      }
    }
  }, [
    hash,
    localRuleData.ruleNumbers,
    localRuleData.rulesInUse,
    previousSearchTerm,
    searchData.previousSearchTerm,
    searchResults.searchTerm,
    searchTerm,
  ]);

  // Clean up after scrolling
  useEffect(() => {
    // Scrolling complete, disable component rendering
    if (scrolled && scrollRules.promptScrollToRule) {
      setScrollRules((prevValue) => ({
        ...prevValue,
        promptScrollToRule: 0,
      }));
      // Reset local state
      setScrolled(0);
    }
  }, [scrollRules.promptScrollToRule, scrolled, setScrollRules]);

  return null;
};

export default RuleScroll;
