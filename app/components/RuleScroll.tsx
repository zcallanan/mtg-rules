import {
  Dispatch,
  SetStateAction,
  MutableRefObject,
  useEffect,
  useState,
} from "react";
import { Rule, ScrollRules } from "../typing/types";

interface Props {
  ruleNumberRefs: MutableRefObject<HTMLSpanElement[]>;
  rulesInUse: Rule[];
  scrollRules: ScrollRules;
  setScrollRules: Dispatch<SetStateAction<ScrollRules>>;
}

const RuleScroll = (props: Props): JSX.Element => {
  const { ruleNumberRefs, rulesInUse, scrollRules, setScrollRules } = props;

  const [localRules, setLocalRules] = useState<Rule[]>(null);

  // Save to local state to ensure updated rulesRef is evaluated
  useEffect(() => {
    if (localRules !== rulesInUse) {
      setLocalRules(rulesInUse);
    }
  }, [rulesInUse, localRules]);

  // Scroll to scrollRules.hash
  useEffect(() => {
    const re = new RegExp(`(${scrollRules.hash})`);
    const element = ruleNumberRefs.current.find((elem) =>
      re.test(elem.innerText)
    );
    element.scrollIntoView();
  }, [ruleNumberRefs, scrollRules.hash]);

  // Scrolling complete, set scrollRules.val to evaluate false
  useEffect(() => {
    if (scrollRules) {
      setScrollRules((prevValue) => ({
        ...prevValue,
        val: 0,
      }));
    }
  }, [scrollRules, setScrollRules]);

  return null;
};

export default RuleScroll;
