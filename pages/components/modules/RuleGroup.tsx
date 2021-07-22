import { Chapter, Rule, Subrule } from "../../../app/types";
import RuleList from "./RuleList";

interface Props {
  chapter: Chapter;
  rules: Rule[];
  subrules: Subrule[];
  elRef: HTMLDivElement | null;
  onLinkClick: (chapterNumber: number) => number;
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
            chapter={chapter}
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
