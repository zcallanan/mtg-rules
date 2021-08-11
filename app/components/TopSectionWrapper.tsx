import {
  MutableRefObject,
  Dispatch,
  useEffect,
  useState,
  SetStateAction,
  memo,
} from "react";
import { useRouter } from "next/router";
import useTopSection from "../hooks/useTopSection";
import { Section } from "../typing/types";

interface Props {
  divArray: HTMLDivElement[];
  leftViewportRef: MutableRefObject<HTMLDivElement>;
  sectionsInUse: Section[];
  scrolledToSection: number;
  setScrolledToSection: Dispatch<SetStateAction<number>>;
}

const TopSectionWrapper = (props: Props): JSX.Element => {
  const {
    divArray,
    leftViewportRef,
    sectionsInUse,
    scrolledToSection,
    setScrolledToSection,
  } = props;

  // State
  const [anchorValue, setAnchorValue] = useState<string>("");

  // Get path from useRouter
  const path: string[] = useRouter().asPath.split("#");

  // Save local value of anchorValue to determine toc section at load
  useEffect(() => {
    if (path && path.length > 1) {
      const [anchorChapter] = path[1].match(/\d{3}/);
      if (anchorValue !== anchorChapter) {
        setAnchorValue(anchorChapter);
      }
    }
  }, [anchorValue, path]);

  // Latest section # from scrolling callback or from anchor value at load
  const callbackValue: number | void = useTopSection(
    divArray,
    leftViewportRef,
    sectionsInUse
  );

  const latestScrolledToSection: number =
    callbackValue ||
    (anchorValue ? Number(anchorValue.match(/\b(\d{1})(?=\d)/)[0]) : undefined);

  // Save the latest value from useTopSection to TocSections state
  useEffect(() => {
    if (
      latestScrolledToSection &&
      scrolledToSection !== latestScrolledToSection
    ) {
      setScrolledToSection(latestScrolledToSection);
    }
  }, [scrolledToSection, setScrolledToSection, latestScrolledToSection]);

  return null;
};

export default memo(TopSectionWrapper);
