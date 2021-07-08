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
}

const SectionList = (props: Props): JSX.Element => {
  const {
    sections,
    chapters,
    rules,
    subrules,
  } = props;

  return (
    <div>
      {sections.map((section, index) => (
        <div key={`${section.sectionNumber}-${index}`}>
        <section id={`${section.sectionNumber}`}>
          <span>
            {section.sectionNumber}. &nbsp; {section.text}
          </span>
        </section>
          <ChapterList chapters={chapters} rules={rules} subrules={subrules} />
        </div>
      ))}
    </div>
  );
};

export default SectionList;
