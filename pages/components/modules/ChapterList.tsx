import React from "react";
import RuleGroup from "./RuleGroup";
import ChapterTitle from "./ChapterTitle";
import { Chapter, Rule, Subrule } from "../../../app/types";
import styles from "../../../styles/ChapterList.module.scss";

interface Props {
  chapters: Chapter[];
  rules: Rule[];
  subrules: Subrule[];
}

const ChapterList = (props: Props): JSX.Element => {
  const { chapters, rules, subrules } = props;

  return (
    <div>
      {chapters.map((chapter, index) => (
        <div key={index}>
          <ChapterTitle chapter={chapter} toc={0}/>
          <RuleGroup chapter={chapter} rules={rules} subrules={subrules} />
        </div>
      ))}
    </div>
  );
};

export default ChapterList;
