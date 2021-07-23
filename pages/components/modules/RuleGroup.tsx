import { Chapter, Rule, Subrule } from "../../../app/types";
import RuleList from "./RuleList";

interface Props {
  chapter: Chapter;
  rules: Rule[];
  subrules: Subrule[];
  elRef: HTMLDivElement | null;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
}

const RuleGroup = (props: Props): JSX.Element => {
  const {
    chapter,
    rules,
    subrules,
    elRef,
    onLinkClick,
  } = props;

  const ruleSubset = rules.filter(
    (rule) => rule.chapterNumber === chapter.chapterNumber,
  );

  return (
    <div>
      {ruleSubset && (
        <ul key={`c-u${chapter.chapterNumber}`} className={"list-group"}>
          <RuleList
            ruleSubset={ruleSubset}
            subrules={subrules}
            elRef={elRef}
            onLinkClick={onLinkClick}
          />
        </ul>
      )}
    </div>
  );
};

export default RuleGroup;
