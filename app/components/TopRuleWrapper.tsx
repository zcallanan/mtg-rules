import { MutableRefObject } from "react";
import useTopRule from "../hooks/useTopRule";
import { Rule } from "../typing/types";

interface Props {
  rootRef: MutableRefObject<HTMLDivElement>;
  topRuleProp: (n: number) => void;
  rulesRef: MutableRefObject<HTMLDivElement[]>;
  init: number;
  rulesInUse: Rule[];
}

const TopRuleWrapper = (props: Props): JSX.Element => {
  const { rootRef, topRuleProp, rulesRef, init, rulesInUse } = props;

  /*
    - Without this wrapper, useTopRule's rootRef is undefined for a fallback page
    as the rootRef is defined after values are passed to useTopRule.
    - This wrapper allows conditional calling of useTopRule
    - At page load, prop returns 100
    - At rule div intersection with viewport, prop returns useTopRule callback return
  */
  topRuleProp(useTopRule(rulesRef.current, rootRef, rulesInUse) || init);

  return null;
};

export default TopRuleWrapper;
