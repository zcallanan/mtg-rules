import { MutableRefObject } from "react";
import RuleGroup from "./RuleGroup";
import {
  Section,
  Chapter,
  Rule,
  Subrule,
} from "../typing/types";
// import styles from "../styles/ChapterList.module.scss";

interface Props {
  section?: Section;
  chapters: Chapter[];
  rules?: Rule[];
  subrules?: Subrule[];
  elRef: MutableRefObject<HTMLDivElement[]>;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchTerm: string;
}

const ChapterList = (props: Props): JSX.Element => {
  const {
    section,
    chapters,
    rules,
    subrules,
    elRef,
    onLinkClick,
    searchTerm,
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
            searchTerm={searchTerm}
          />
        </div>
      ))}
    </div>
  );
};

export default ChapterList;
