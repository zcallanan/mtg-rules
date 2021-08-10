import { RefObject, MutableRefObject } from "react";
import { Spinner } from "react-bootstrap";
import ChapterList from "./ChapterList";
import {
  Section,
  Chapter,
  Rule,
  Subrule,
  SearchResults,
} from "../typing/types";
import styles from "../styles/SectionList.module.scss";

interface Props {
  sections: Section[];
  chapters: Chapter[];
  rules: Rule[];
  subrules: Subrule[];
  ruleNumberRefs: MutableRefObject<HTMLSpanElement[]>;
  elRef: MutableRefObject<HTMLDivElement[]>;
  root: RefObject<HTMLDivElement> | null;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchResults: SearchResults;
}

const SectionList = (props: Props): JSX.Element => {
  const {
    sections,
    chapters,
    rules,
    subrules,
    ruleNumberRefs,
    elRef,
    root,
    onLinkClick,
    searchResults,
  } = props;

  return (
    <div className={styles.scrollableDiv} ref={root}>
      {sections.length ? (
        sections.map((section, index) => (
          <div key={`${section.sectionNumber}-${index}`}>
            <ChapterList
              section={section}
              chapters={chapters}
              rules={rules}
              subrules={subrules}
              ruleNumberRefs={ruleNumberRefs}
              elRef={elRef}
              onLinkClick={onLinkClick}
              searchResults={searchResults}
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

export default SectionList;
