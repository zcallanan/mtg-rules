import { useRouter } from "next/router";
import SubruleGroup from "./SubruleGroup";
import Example from "./Example";
import parseLink from "../../../app/parse-link";
import { Rule, Subrule, RouterValues } from "../../../app/types";
import styles from "../../../styles/RuleList.module.scss";

interface Props {
  ruleSubset: Rule[];
  subrules: Subrule[];
  elRef: HTMLDivElement | null;
}

const RuleList = (props: Props): JSX.Element => {
  const { ruleSubset, subrules, elRef } = props;

  const router = useRouter();
  const routerValues: RouterValues = {
    year: router.query.year,
    version: router.query.version,
  };

  return (
    <div>
      {ruleSubset.map((rule, index) => (
        <div key={`ruleListDiv-${index}`} className={styles.ruleDiv} ref={elRef}>
          <section id={`${rule.chapterNumber}.${rule.ruleNumber}`}>
            <li
              key={`r${rule.ruleNumber}`}
              className={`${styles.ruleText} list-group-item`}
            >
              {rule.chapterNumber}.{rule.ruleNumber} &nbsp; {parseLink(rule, routerValues)}
            </li>
          </section>
          <Example rule={rule} />
          <SubruleGroup rule={rule} subrules={subrules} />
        </div>
      ))}
    </div>
  );
};

export default RuleList;
