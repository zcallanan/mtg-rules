import {
  useEffect,
  useRef,
  RefObject,
  useCallback,
  useState,
} from "react";

const useTopRule = (
  refArray: RefObject<HTMLElement>[] = null,
  root: RefObject<HTMLDivElement> | null = null,
): number | void => {
  const observerRef = useRef<IntersectionObserver>(null);
  const [ruleNumber, setRuleNumber] = useState();

  const callback = useCallback(([entry]) => {
    if (entry.isIntersecting) {
      console.log(entry);
      setRuleNumber(Number(entry.target.outerText.match(/(\d{3})/g)[0]));
    }
  }, []);

  useEffect(() => {
    // IntersectionRect set to top of .scrollableDiv viewport
    const options = {
      rootMargin: "0px 0px -99% 0px",
      root,
    };

    observerRef.current = new IntersectionObserver(callback, options);
  }, [callback, root]);

  useEffect(() => {
    // Disconnect from all rule refs before observing refArray contents
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Observe all rule ref contents
    refArray.forEach((r) => {
      observerRef.current.observe(r);
    });
  }, [refArray]);

  // Cleanup
  useEffect(() => () => {
    observerRef.current.disconnect();
  }, []);

  // Return
  return ruleNumber;
};

export default useTopRule;
