import { memo } from "react";
import { Rule, SearchResults, Subrule } from "../typing/types";
import SubruleList from "./SubruleList";

interface Props {
  rule: Rule;
  subrules: Subrule[];
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchResults: SearchResults;
  allChaptersN: string[];
}

const SubruleGroup = (props: Props): JSX.Element => {
  const { rule, subrules, onLinkClick, searchResults, allChaptersN } = props;

  // Create subset of subrules with the same ruleNumber and chapterNumber
  const subruleSubset = subrules.filter(
    (subrule) =>
      rule.ruleNumber === subrule.ruleNumber &&
      rule.chapterNumber === subrule.chapterNumber
  );

  return (
    <div>
      {subruleSubset && (
        <ul className={"list-group"}>
          <SubruleList
            subruleSubset={subruleSubset}
            onLinkClick={onLinkClick}
            searchResults={searchResults}
            allChaptersN={allChaptersN}
          />
        </ul>
      )}
    </div>
  );
};

export default memo(SubruleGroup);
