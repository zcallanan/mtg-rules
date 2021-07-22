import { Rule, Subrule } from "../../../app/types";
import SubruleList from "./SubruleList";

interface Props {
  rule: Rule;
  subrules: Subrule[];
}

const SubruleGroup = (props: Props): JSX.Element => {
  const { rule, subrules } = props;

  const subruleSubset = subrules.filter(
    (subrule) => rule.ruleNumber === subrule.ruleNumber
      && rule.chapterNumber === subrule.chapterNumber,
  );

  return (
    <div>
      {subruleSubset && (
        <ul className={"list-group"}>
          <SubruleList subruleSubset={subruleSubset} />
        </ul>
      )}
    </div>
  );
};

export default SubruleGroup;
