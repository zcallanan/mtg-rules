import { MutableRefObject, memo } from "react";
import { Chapter, Rule, SearchResults, Subrule } from "../typing/types";
import RuleList from "./RuleList";

interface Props {
  chapter: Chapter;
  rules: Rule[];
  subrules: Subrule[];
  ruleNumberRefs: MutableRefObject<HTMLSpanElement[]>;
  elRef: MutableRefObject<HTMLDivElement[]>;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchResults: SearchResults;
  allChaptersN: string[];
}

const RuleGroup = (props: Props): JSX.Element => {
  const {
    chapter,
    rules,
    subrules,
    ruleNumberRefs,
    elRef,
    onLinkClick,
    searchResults,
    allChaptersN,
  } = props;

  // Create subset of rules with the same chapterNumber
  const ruleSubset = rules.filter(
    (rule) => rule.chapterNumber === chapter.chapterNumber
  );

  return (
    <div>
      {ruleSubset && (
        <ul key={`c-u${chapter.chapterNumber}`} className={"list-group"}>
          <RuleList
            ruleSubset={ruleSubset}
            rules={rules}
            subrules={subrules}
            ruleNumberRefs={ruleNumberRefs}
            elRef={elRef}
            onLinkClick={onLinkClick}
            searchResults={searchResults}
            allChaptersN={allChaptersN}
          />
        </ul>
      )}
    </div>
  );
};

export default memo(RuleGroup);
