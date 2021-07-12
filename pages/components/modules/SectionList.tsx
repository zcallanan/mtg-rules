import React from "react";
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
}

const SectionList = (props: Props): JSX.Element => {
  const {
    sections,
    chapters,
    rules,
    subrules,
    elRef,
    root,
  } = props;

  return (
    <div className={styles.scrollableDiv} ref={root}>
      {sections.map((section, index) => (
        <div key={`${section.sectionNumber}-${index}`}>
          <section id={`${section.sectionNumber}`}>
          </section>
          <ChapterList
            section={section}
            chapters={chapters}
            rules={rules}
            subrules={subrules}
            elRef={elRef}
          />
        </div>
      ))}
    </div>
  );
};

export default SectionList;
