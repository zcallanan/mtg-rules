import {
  useEffect,
  useRef,
  RefObject,
  useCallback,
  useState,
} from "react";

const useTopRule = (
  refArray: RefObject<HTMLElement>[],
  root: RefObject<HTMLDivElement> | null = null,
): number => {
  const observerRef = useRef<IntersectionObserver>(null);
  const [ruleNumber, setRuleNumber] = useState();

  const callback = useCallback(([entry]) => {
    if (entry.isIntersecting) {
      console.log(entry);
      setRuleNumber(Number(entry.target.outerHTML.match(/(\d{3})/g)[0]));
    }
  }, []);

  useEffect(() => {
    // IntersectionRect set to top of .scrollableDiv viewport
    const options = {
      rootMargin: "0px 0px -100% 0px",
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
    console.log(refArray);
    refArray.forEach((r) => {
      observerRef.current.observe(r);
    });
  }, [refArray]);
  return ruleNumber;
};

export default useTopRule;
