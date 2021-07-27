import {
  useEffect,
  useRef,
  useCallback,
  useState,
  RefObject,
} from "react";
import { Rule } from "../typing/types";

const useTopRule = (
  refArray: HTMLDivElement[] = null,
  root: RefObject<HTMLDivElement> | null = null,
  rulesInUse: Rule[],
): number | void => {
  const observerRef = useRef<IntersectionObserver>(null);
  const [ruleNumber, setRuleNumber] = useState<number>();

  const callback = useCallback(([entry]) => {
    if (entry.isIntersecting) {
      console.log(entry);
      setRuleNumber(Number(entry.target.innerText.match(/(\d{3})/g)[0]));
    }
  }, []);

  useEffect(() => {
    // IntersectionRect set to top of .scrollableDiv viewport
    const options = {
      rootMargin: "0px 0px -99% 0px",
      root: root.current,
    };

    observerRef.current = new IntersectionObserver(callback, options);
  }, [callback, root]);

  useEffect(() => {
    // Disconnect from all rule refs before observing refArray contents
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    /* 
      Observe all rule ref contents. Force observation when rulesInUse changes
      else refArray's size change occurs after value is passed to callback,
      resulting in no rule observation after a search and observation ceasing
    */
    refArray.forEach((r) => {
      if (r && rulesInUse) {
        observerRef.current.observe(r);
      }
    });
  }, [refArray, rulesInUse]);

  // Cleanup
  useEffect(() => () => {
    observerRef.current.disconnect();
  }, []);

  // Return
  return ruleNumber;
};

export default useTopRule;
