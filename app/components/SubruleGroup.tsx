import { Rule, Subrule } from "../typing/types";
import SubruleList from "./SubruleList";

interface Props {
  rule: Rule;
  subrules: Subrule[];
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchTerm: string;
}

const SubruleGroup = (props: Props): JSX.Element => {
  const { rule, subrules, onLinkClick, searchTerm } = props;

  const subruleSubset = subrules.filter(
    (subrule) => rule.ruleNumber === subrule.ruleNumber
      && rule.chapterNumber === subrule.chapterNumber,
  );

  return (
    <div>
      {subruleSubset && (
        <ul className={"list-group"}>
          <SubruleList 
            subruleSubset={subruleSubset}
            onLinkClick={onLinkClick}
            searchTerm={searchTerm}
          />
        </ul>
      )}
    </div>
  );
};

export default SubruleGroup;
