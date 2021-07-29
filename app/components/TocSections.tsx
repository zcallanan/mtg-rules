import { MutableRefObject } from "react";
import TocChapterList from "./TocChapterList";
import { Section, Chapter } from "../typing/types";
import styles from "../styles/TocSections.module.scss";

interface Props {
  sections: Section[];
  chapters: Chapter[];
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  tocTitleRef: MutableRefObject<HTMLDivElement[]>;
}

const TocSections = (props: Props): JSX.Element => {
  const { sections, chapters, onLinkClick, tocTitleRef } = props;

  return (
    <div>
      {sections.map((section) => (
        <div key={`s${section.sectionNumber}`}>
          <span className={styles.sectionText}>
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
