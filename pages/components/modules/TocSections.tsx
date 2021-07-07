import React from "react";
import TocChapterList from "./TocChapterList";
import { Section, Chapter } from "../../../app/types";
import styles from "../../../styles/TocSections.module.scss";

interface Props {
  sections: Section[];
  chapters: Chapter[];
}

const TocSections = (props: Props): JSX.Element => {
  const { sections, chapters } = props;

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
          />
        </div>
      ))}
    </div>
  );
};

export default TocSections;
