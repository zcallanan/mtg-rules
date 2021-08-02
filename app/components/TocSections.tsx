import { useRef, MutableRefObject, useEffect, useState } from "react";
import TocChapterList from "./TocChapterList";
import TopSectionWrapper from "./TopSectionWrapper";
import objectArrayComparison from "../utils/object-array-comparison";
import { Section, Chapter, SearchResults } from "../typing/types";
import styles from "../styles/TocSections.module.scss";

interface Props {
  sections: Section[];
  chapters: Chapter[];
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  tocTitleRef: MutableRefObject<HTMLDivElement[]>;
  leftViewportRef: MutableRefObject<HTMLDivElement>;
  searchResults: SearchResults;
}

const TocSections = (props: Props): JSX.Element => {
  const {
    sections,
    chapters,
    onLinkClick,
    tocTitleRef,
    leftViewportRef,
    searchResults,
  } = props;

  // State
  const [scrolledToSection, setScrolledToSection] = useState<number>(0);

  // Collect mutable refs in [] for useTopSection to iterate over and observe
  const sectionTextRefs = useRef<HTMLSpanElement[]>([]);

  const [sectionsInUse, setSectionsInUse] = useState<Section[]>([]);

  // Ref won't inform a child of update, so use state
  const [spanArray, setSpanArray] = useState<HTMLSpanElement[]>(null);

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

  // Save spanArray to state to pass to callback wrapper TopSectionWrapper
  useEffect(() => {
    if (spanArray !== sectionTextRefs.current) {
      setSpanArray(sectionTextRefs.current);
    }
  }, [spanArray]);

  // Position the topmost section as sticky within the leftContainer, so that it is visible on scroll
  useEffect(() => {
    if (scrolledToSection) {
      sectionTextRefs.current[scrolledToSection - 1].style.position = "sticky";
      sectionTextRefs.current[scrolledToSection - 1].style.top = "0";
    }
  }, [scrolledToSection]);

  return (
    <div>
      {leftViewportRef && (
        <TopSectionWrapper
          leftViewportRef={leftViewportRef}
          spanArray={spanArray}
          sectionsInUse={sectionsInUse}
          scrolledToSection={scrolledToSection}
          setScrolledToSection={setScrolledToSection}
        />
      )}
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
