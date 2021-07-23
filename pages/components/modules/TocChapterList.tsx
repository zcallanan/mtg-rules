import ChapterTitle from "./ChapterTitle";
import { Chapter } from "../../../app/types";
import styles from "../../../styles/TocChapterList.module.scss";

interface Props {
  chapters: Chapter[];
  sectionNumber: number;
  toc: number;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  tocTitleRef: HTMLDivElement | null;
}

const TocChapterList = (props: Props): JSX.Element => {
  const {
    chapters,
    sectionNumber,
    toc,
    onLinkClick,
    tocTitleRef,
  } = props;

  const chapterSubset = chapters.filter((chapter) => chapter.sectionNumber === sectionNumber);

  return (
    <div className={styles.tocChapters}>
      {chapterSubset.map((chapter, index) => (
        <ul className={"list-group"} key={`titles-${index}`}>
          <ChapterTitle
            chapter={chapter}
            toc={toc}
            onLinkClick={onLinkClick}
            tocTitleRef={tocTitleRef}
          />
        </ul>
      ))}
    </div>
  );
};

export default TocChapterList;
