import { MutableRefObject } from "react";
import { Chapter, Rule, Subrule } from "../typing/types";
import RuleList from "./RuleList";

interface Props {
  chapter: Chapter;
  rules: Rule[];
  subrules: Subrule[];
  elRef: MutableRefObject<HTMLDivElement[]>;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchTerm: string;
}

const RuleGroup = (props: Props): JSX.Element => {
  const { chapter, rules, subrules, elRef, onLinkClick, searchTerm } = props;

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
            searchTerm={searchTerm}
          />
        </ul>
      )}
    </div>
  );
};

export default RuleGroup;
