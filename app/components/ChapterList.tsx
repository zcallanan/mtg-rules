import { MutableRefObject, memo } from "react";
import RuleGroup from "./RuleGroup";
import {
  Section,
  Chapter,
  Rule,
  Subrule,
  SearchResults,
} from "../typing/types";

interface Props {
  section?: Section;
  chapters: Chapter[];
  rules?: Rule[];
  subrules?: Subrule[];
  ruleNumberRefs: MutableRefObject<HTMLSpanElement[]>;
  elRef: MutableRefObject<HTMLDivElement[]>;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchResults: SearchResults;
}

const ChapterList = (props: Props): JSX.Element => {
  const {
    section,
    chapters,
    rules,
    subrules,
    ruleNumberRefs,
    elRef,
    onLinkClick,
    searchResults,
  } = props;

  // Create subset of chapters with the same sectionNumber
  let chapterSubset: Chapter[];
  if (section) {
    chapterSubset = chapters.filter(
      (chapter) => chapter.sectionNumber === section.sectionNumber
    );
  }

  // Create string array of chapter numbers for use in parseLinks
  const allChaptersN: string[] = chapters.map((ch) =>
    ch.chapterNumber.toString()
  );

  return (
    <div>
      {chapterSubset.map((chapter, index) => (
        <div key={`chapter${chapter.chapterNumber}-${index}`}>
          <section id={`${chapter.chapterNumber}`}></section>
          <RuleGroup
            chapter={chapter}
            rules={rules}
            subrules={subrules}
            ruleNumberRefs={ruleNumberRefs}
            elRef={elRef}
            onLinkClick={onLinkClick}
            searchResults={searchResults}
            allChaptersN={allChaptersN}
          />
        </div>
      ))}
    </div>
  );
};

export default memo(ChapterList);
