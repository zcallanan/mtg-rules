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

  const result: number = useTopRule(rulesRef.current, rootRef) || init;
  console.log(result)

  wrapperProp(result);

  return (null);
}

export default CallbackWrapper;