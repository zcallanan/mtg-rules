import { RefObject, MutableRefObject } from "react";
import { Spinner } from "react-bootstrap";
import ChapterList from "./ChapterList";
import {
  Section,
  Chapter,
  Rule,
  Subrule,
} from "../typing/types";
import styles from "../styles/SectionList.module.scss";

interface Props {
  sections: Section[];
  chapters: Chapter[];
  rules: Rule[];
  subrules: Subrule[];
  elRef: MutableRefObject<HTMLDivElement[]>;
  root: RefObject<HTMLDivElement> | null;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchTerm: string;
}

const SectionList = (props: Props): JSX.Element => {
  const {
    sections,
    chapters,
    rules,
    subrules,
    elRef,
    root,
    onLinkClick,
    searchTerm,
  } = props;

  console.log(searchTerm)

  return (
    <div className={styles.scrollableDiv} ref={root}>
      {sections.length
        ? (sections.map((section, index) => (
          <div key={`${section.sectionNumber}-${index}`}>
            <ChapterList
              section={section}
              chapters={chapters}
              rules={rules}
              subrules={subrules}
              elRef={elRef}
              onLinkClick={onLinkClick}
              searchTerm={searchTerm}
            />
          </div>
        )))
        : (
          <div className={styles.spinnerDiv}>
            <Spinner
              animation="border"
              role="status"
              variant="dark"
              className={styles.spinnerComponent}
            >
              <span className={styles.loadingText}>Loading</span>
            </Spinner>
          </div>
        )
      }
    </div>
  );
};

export default SectionList;
