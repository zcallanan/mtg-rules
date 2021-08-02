import { MutableRefObject } from "react";
import ChapterTitle from "./ChapterTitle";
import { Chapter } from "../typing/types";
import styles from "../styles/TocChapterList.module.scss";

interface Props {
  chapters: Chapter[];
  sectionNumber: number;
  toc: number;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  tocTitleRef: MutableRefObject<HTMLDivElement[]>;
  tocChapterListRefs: MutableRefObject<HTMLDivElement[]>;
}

const TocChapterList = (props: Props): JSX.Element => {
  const {
    chapters,
    sectionNumber,
    toc,
    onLinkClick,
    tocTitleRef,
    tocChapterListRefs,
  } = props;

  const chapterSubset = chapters.filter(
    (chapter) => chapter.sectionNumber === sectionNumber
  );

  return (
    <div
      className={styles.tocChaptersContainer}
      // eslint-disable-next-line no-return-assign
      ref={(el) => (tocChapterListRefs.current[sectionNumber - 1] = el)}
    >
      <ul className={"list-group"}>
        {chapterSubset.map((chapter, index) => (
          <ChapterTitle
            key={`chapterTitle-${index}`}
            chapter={chapter}
            toc={toc}
            onLinkClick={onLinkClick}
            tocTitleRef={tocTitleRef}
            i={chapters.findIndex(
              (ch) => ch.chapterNumber === chapter.chapterNumber
            )}
          />
        ))}
      </ul>
    </div>
  );
};

export default TocChapterList;
