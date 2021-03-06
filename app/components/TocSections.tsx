import { useRef, MutableRefObject, useEffect, useState, memo } from "react";
import { Spinner } from "react-bootstrap";
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
  const sectionCardRefs = useRef<HTMLSpanElement[]>([]);
  const tocSectionListRefs = useRef<HTMLDivElement[]>([]);

  const [sectionsInUse, setSectionsInUse] = useState<Section[]>([]);

  // Ref won't inform a child of update, so use state
  const [divArray, setDivArray] = useState<HTMLDivElement[]>(null);

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
      sectionCardRefs.current = sectionCardRefs.current.slice(
        0,
        sectionsInUse.length
      );
    }
  }, [sectionsInUse]);

  // Save divArray to state to pass to callback wrapper TopSectionWrapper
  useEffect(() => {
    if (divArray !== tocSectionListRefs.current) {
      setDivArray(tocSectionListRefs.current);
    }
  }, [divArray]);

  // Position the topmost section as sticky within the leftContainer, so that it is visible on scroll
  useEffect(() => {
    if (scrolledToSection) {
      const n = scrolledToSection - 1;
      const arr = sectionCardRefs.current;
      arr[n].style.position = "sticky";
      arr[n].style.top = "0";
    }
  }, [scrolledToSection]);

  return (
    <div>
      {!!leftViewportRef && !!sections.length && (
        <TopSectionWrapper
          leftViewportRef={leftViewportRef}
          divArray={divArray}
          sectionsInUse={sectionsInUse}
          scrolledToSection={scrolledToSection}
          setScrolledToSection={setScrolledToSection}
        />
      )}
      {sections.length ? (
        sections.map((section, i) => (
          <div
            // eslint-disable-next-line no-return-assign
            ref={(el) => (tocSectionListRefs.current[i] = el)}
            className={styles.tocSectionContainer}
            key={`s${section.sectionNumber}`}
          >
            <span
              className={styles.tocSectionCard}
              // eslint-disable-next-line no-return-assign
              ref={(el) => (sectionCardRefs.current[i] = el)}
            >
              {`${section.sectionNumber}. ${section.text}`}
            </span>
            <TocChapterList
              sectionNumber={section.sectionNumber}
              chapters={chapters}
              toc={1}
              onLinkClick={onLinkClick}
              tocTitleRef={tocTitleRef}
            />
          </div>
        ))
      ) : (
        <div className={styles.spinnerDiv}>
          <Spinner
            animation="border"
            role="status"
            variant="dark"
            className={styles.spinnerComponent}
          >
            <span className={styles.loadingText}></span>
          </Spinner>
        </div>
      )}
    </div>
  );
};

export default memo(TocSections);
