import { MutableRefObject, memo } from "react";
import ChapterTitle from "./ChapterTitle";
import { Chapter } from "../typing/types";

interface Props {
  chapters: Chapter[];
  sectionNumber: number;
  toc: number;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  tocTitleRef: MutableRefObject<HTMLDivElement[]>;
}

const TocChapterList = (props: Props): JSX.Element => {
  const { chapters, sectionNumber, toc, onLinkClick, tocTitleRef } = props;

  const chapterSubset = chapters.filter(
    (chapter) => chapter.sectionNumber === sectionNumber
  );

  return (
    <div>
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

export default memo(TocChapterList);
