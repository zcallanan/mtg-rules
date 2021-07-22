import { Spinner } from "react-bootstrap";
import ChapterList from "./ChapterList";
import {
  Section,
  Chapter,
  Rule,
  Subrule,
} from "../../../app/types";
import styles from "../../../styles/SectionList.module.scss";

interface Props {
  sections: Section[];
  chapters: Chapter[];
  rules: Rule[];
  subrules: Subrule[];
  elRef: HTMLDivElement | null;
  root: HTMLDivElement | null;
  onLinkClick: (chapterNumber: number) => number;
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
  } = props;

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
