import React from "react";
import ChapterTitle from "./ChapterTitle";
import { Chapter } from "../../../app/types";
import styles from "../../../styles/TocChapterList.module.scss";

interface Props {
  chapters: Chapter[];
}

const TocChapterList = (props: Props): JSX.Element => {
  const { chapters } = props;

  return (
    <div className={styles.tocChapters}>
      {chapters.map((chapter, index) => (
        <ul className={"list-group"} key={`titles-${index}`}>
          <ChapterTitle chapter={chapter} toc={1} />
        </ul>
      ))}
    </div>
  );
};

export default TocChapterList;
