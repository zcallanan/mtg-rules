import { useRef, MutableRefObject, useEffect, useState } from "react";
import { useRouter } from "next/router";
import TocChapterList from "./TocChapterList";
import useTopSection from "../hooks/useTopSection";
import objectArrayComparison from "../utils/object-array-comparison";
import { Section, Chapter, SearchResults } from "../typing/types";
import styles from "../styles/TocSections.module.scss";

interface Props {
  sections: Section[];
  chapters: Chapter[];
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  tocTitleRef: MutableRefObject<HTMLDivElement[]>;
  leftViewport: MutableRefObject<HTMLDivElement>;
  searchResults: SearchResults;
}

const TocSections = (props: Props): JSX.Element => {
  const {
    sections,
    chapters,
    onLinkClick,
    tocTitleRef,
    leftViewport,
    searchResults,
  } = props;

  // State
  const [sectionsInUse, setSectionsInUse] = useState<Section[]>([]);
  const [scrolledToSection, setScrolledToSection] = useState<number>(0);
  const [anchorValue, setAnchorValue] = useState<string>("");

  // Collect mutable refs in [] for useTopSection to iterate over and observe
  const sectionTextRefs = useRef<HTMLSpanElement[]>([]);

  const localSearchResults = useRef<SearchResults>({
    searchTerm: "",
    searchType: "",
    searchSections: [],
    searchChapters: [],
    searchRules: [],
    searchSubrules: [],
    searchResult: 1,
  });

  // Initial searchResults does not exist. Use local value until it exists. Fixes track sections dependency crash
  useEffect(() => {
    if (searchResults) {
      localSearchResults.current = searchResults;
    }
  }, [searchResults]);

  // Track what sections are rendered
  useEffect(() => {
    // Either the search result else default
    const result = localSearchResults.current.searchSections.length
      ? localSearchResults.current.searchSections
      : sections;
    // Save the sections in use to state
    if (!objectArrayComparison(result, sectionsInUse)) {
      setSectionsInUse(result);
    }
  }, [sections, sectionsInUse, localSearchResults.current.searchSections]);

  // Adjust the size of sectionTextRef to trigger observation of rules by useTopSections
  useEffect(() => {
    if (sectionsInUse.length) {
      sectionTextRefs.current = sectionTextRefs.current.slice(
        0,
        sectionsInUse.length
      );
    }
  }, [sectionsInUse]);

  // Get path from useRouter
  const path: string[] = useRouter().asPath.split("#");

  // Save local value of anchorValue to determine toc section at load
  useEffect(() => {
    const [anchorChapter] = path[1].match(/\d{3}/);
    if (anchorValue !== anchorChapter) {
      setAnchorValue(anchorChapter);
    }
  }, [anchorValue, path]);

  // Latest section # from scrolling callback or from anchor value at load
  const latestScrolledToSection =
    useTopSection(sectionTextRefs.current, leftViewport, sectionsInUse) ||
    anchorValue
      ? Number(anchorValue.match(/(?<=\b)(\d{1})(?=\d)/)[0])
      : undefined;

  // Save the latest value from useTopSection to state
  useEffect(() => {
    if (
      latestScrolledToSection &&
      scrolledToSection !== latestScrolledToSection
    ) {
      setScrolledToSection(latestScrolledToSection);
    }
  }, [scrolledToSection, latestScrolledToSection]);

  // Position the topmost section as sticky within the leftContainer, so that it is visible on scroll
  useEffect(() => {
    if (scrolledToSection) {
      sectionTextRefs.current[scrolledToSection - 1].style.position = "sticky";
      sectionTextRefs.current[scrolledToSection - 1].style.top = "0";
    }
  }, [scrolledToSection]);

  return (
    <div>
      {sections.map((section, i) => (
        <div key={`s${section.sectionNumber}`}>
          <span
            className={styles.sectionText}
            // eslint-disable-next-line no-return-assign
            ref={(el) => (sectionTextRefs.current[i] = el)}
          >
            {section.sectionNumber}. &nbsp; {section.text}
          </span>
          <TocChapterList
            sectionNumber={section.sectionNumber}
            chapters={chapters}
            toc={1}
            onLinkClick={onLinkClick}
            tocTitleRef={tocTitleRef}
          />
        </div>
      ))}
    </div>
  );
};

export default TocSections;
