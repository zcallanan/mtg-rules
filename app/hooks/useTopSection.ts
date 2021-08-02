import { useEffect, useRef, useCallback, useState, RefObject } from "react";
import { Section } from "../typing/types";

const useTopSection = (
  refArray: HTMLSpanElement[] = null,
  root: RefObject<HTMLDivElement> | null = null,
  sectionsInUse: Section[]
): number | void => {
  const observerRef = useRef<IntersectionObserver>(null);
  const [sectionNumber, setSectionNumber] = useState<number>();

  const callback = useCallback(([entry]) => {
    if (entry.isIntersecting) {
      console.log(entry);
      setSectionNumber(
        Number(entry.target.innerText.match(/(?<=\b)(\d{1})(?=\.)/g)[0])
      );
    }
  }, []);

  useEffect(() => {
    // IntersectionRect set to top of viewport
    const options = {
      rootMargin: "0px 0px -100% 0px",
      root: root.current,
    };

    observerRef.current = new IntersectionObserver(callback, options);
  }, [callback, root]);

  useEffect(() => {
    // Disconnect from all rule refs before observing refArray contents
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Observe all section Divs
    refArray.forEach((s) => {
      if (s && sectionsInUse) {
        observerRef.current.observe(s);
      }
    });
  }, [refArray, sectionsInUse]);

  // Cleanup
  useEffect(
    () => () => {
      observerRef.current.disconnect();
    },
    []
  );

  // Return
  return sectionNumber;
};

export default useTopSection;
