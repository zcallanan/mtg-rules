import TocChapterList from "./TocChapterList";
import { Section, Chapter } from "../../../app/types";
import styles from "../../../styles/TocSections.module.scss";

interface Props {
  sections: Section[];
  chapters: Chapter[];
  tocOnClick: (chapterNumber: number) => number;
}

const TocSections = (props: Props): JSX.Element => {
  const { sections, chapters, tocOnClick } = props;

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
            toc="1"
            tocOnClick={tocOnClick}
          />
        </div>
      ))}
    </div>
  );
};

export default TocSections;
