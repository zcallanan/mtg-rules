import {
  useEffect,
  useRef,
  useCallback,
  useState,
  MutableRefObject,
} from "react";
import { Section } from "../typing/types";

const useTopSection = (
  divArray: HTMLDivElement[] = null,
  root: MutableRefObject<HTMLDivElement>,
  sectionsInUse: Section[]
): number | void => {
  const observerRef = useRef<IntersectionObserver>(null);
  const [sectionNumber, setSectionNumber] = useState<number>();

  const callback = useCallback(([entry]) => {
    if (entry.isIntersecting) {
      setSectionNumber(
        Number(entry.target.innerText.match(/(?<=\b)(\d{1})(?=\d)/g)[0])
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
    if (divArray && divArray.length) {
      divArray.forEach((s) => {
        if (s && sectionsInUse) {
          observerRef.current.observe(s);
        }
      });
    }
  }, [divArray, sectionsInUse]);

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
