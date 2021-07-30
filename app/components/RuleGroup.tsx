import { MutableRefObject } from "react";
import { Chapter, Rule, SearchResults, Subrule } from "../typing/types";
import RuleList from "./RuleList";

interface Props {
  chapter: Chapter;
  rules: Rule[];
  subrules: Subrule[];
  elRef: MutableRefObject<HTMLDivElement[]>;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchResults: SearchResults;
}

const RuleGroup = (props: Props): JSX.Element => {
  const { chapter, rules, subrules, elRef, onLinkClick, searchResults } = props;

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
            elRef={elRef}
            onLinkClick={onLinkClick}
            searchResults={searchResults}
          />
        </ul>
      )}
    </div>
  );
};

export default RuleGroup;
