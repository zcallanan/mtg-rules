import RuleGroup from "./RuleGroup";
import { Chapter, Rule, Subrule } from "../../../app/types";
import styles from "../../../styles/ChapterList.module.scss";

interface Props {
  section?: Section;
  chapters: Chapter[];
  rules?: Rule[];
  subrules?: Subrule[];
  elRef: HTMLDivElement | null;
  onLinkClick: (chapterNumber: number) => number;
}

const ChapterList = (props: Props): JSX.Element => {
  const {
    section,
    chapters,
    rules,
    subrules,
    elRef,
    onLinkClick,
  } = props;

  let chapterSubset: Chapter[];
  if (section) {
    chapterSubset = chapters.filter(
      (chapter) => chapter.sectionNumber === section.sectionNumber,
    );
  }

  return (
    <div>
      {chapterSubset.map((chapter, index) => (
        <div key={`chapter${chapter.chapterNumber}-${index}`}>
          <section id={`${chapter.chapterNumber}`}>
          </section>
          <RuleGroup
            chapter={chapter}
            rules={rules}
            subrules={subrules}
            elRef={elRef}
            onLinkClick={onLinkClick}
          />
        </div>
      ))}
    </div>
  );
};

export default ChapterList;
