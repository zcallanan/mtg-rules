import { MutableRefObject } from "react";
import useTopRule from "../hooks/useTopRule";

interface Props {
    rootRef: MutableRefObject<HTMLDivElement>;
    wrapperProp: (n: number) => void;
    rulesRef: MutableRefObject<HTMLDivElement[]>;
    init: number;
}

const CallbackWrapper = (props: Props): JSX.Element => {
  const { rootRef, wrapperProp, rulesRef, init } = props;

  /*
    - Without this wrapper, useTopRule's rootRef is undefined for a fallback page
    as the rootRef is defined after values are passed to useTopRule.
    - This wrapper allows conditional calling of useTopRule
    - At page load, prop returns 100
    - At rule div intersection with viewport, prop returns useTopRule callback return
  */
  wrapperProp(useTopRule(rulesRef.current, rootRef) || init);

  return (null);
}

export default CallbackWrapper;