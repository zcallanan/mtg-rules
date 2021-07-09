import React from "react";
import RuleGroup from "./RuleGroup";
import ChapterTitle from "./ChapterTitle";
import { Chapter, Rule, Subrule } from "../../../app/types";
import styles from "../../../styles/ChapterList.module.scss";

interface Props {
  section: Section;
  chapters: Chapter[];
  rules: Rule[];
  subrules: Subrule[];
}

const ChapterList = (props: Props): JSX.Element => {
  const {
    section,
    chapters,
    rules,
    subrules,
  } = props;

  const chapterSubset = chapters.filter(
    (chapter) => chapter.sectionNumber === section.sectionNumber,
  );

  return (
    <div>
      {chapterSubset.map((chapter, index) => (
        <div key={`chapter${chapter.chapterNumber}-${index}`}>
          <ChapterTitle chapter={chapter} toc={0} />
          <RuleGroup chapter={chapter} rules={rules} subrules={subrules} />
        </div>
      ))}
    </div>
  );
};

export default ChapterList;
