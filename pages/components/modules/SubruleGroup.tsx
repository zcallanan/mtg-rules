import { Rule, Subrule } from "../../../app/types";
import SubruleList from "./SubruleList";

interface Props {
  rule: Rule;
  subrules: Subrule[];
  onLinkClick: (chapterNumber: number) => number;
}

const SubruleGroup = (props: Props): JSX.Element => {
  const { rule, subrules, onLinkClick } = props;

  const subruleSubset = subrules.filter(
    (subrule) => rule.ruleNumber === subrule.ruleNumber
      && rule.chapterNumber === subrule.chapterNumber,
  );

  return (
    <div>
      {subruleSubset && (
        <ul className={"list-group"}>
          <SubruleList subruleSubset={subruleSubset} onLinkClick={onLinkClick} />
        </ul>
      )}
    </div>
  );
};

export default SubruleGroup;
