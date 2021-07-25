import { MutableRefObject } from "react";
import { useRouter, NextRouter } from "next/router";
import SubruleGroup from "./SubruleGroup";
import Example from "./Example";
import parseLink from "../../../app/parse-link";
import { Rule, Subrule, RouterValues } from "../../../app/types";
import styles from "../../../styles/RuleList.module.scss";

interface Props {
  ruleSubset: Rule[];
  rules: Rule[];
  subrules: Subrule[];
  elRef: MutableRefObject<HTMLDivElement[]>;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
}

const RuleList = (props: Props): JSX.Element => {
  const {
    ruleSubset,
    rules,
    subrules,
    elRef,
    onLinkClick,
  } = props;

  const router: NextRouter = useRouter();
  const year: string = (Array.isArray(router.query.year))
    ? router.query.year[0]
    : router.query.year;
  const version: string = (Array.isArray(router.query.version))
    ? router.query.version[0]
    : router.query.version;
  const routerValues: RouterValues = { year, version };

  return (
    <div>
      {ruleSubset.map((rule, index) => (
        // eslint-disable-next-line no-return-assign
        <div key={`ruleListDiv-${index}`} className={styles.ruleDiv} ref={(el) => elRef.current[
          rules.findIndex((r) => r.ruleNumber === rule.ruleNumber
            && r.chapterNumber === rule.chapterNumber)
        ] = el}>
          <section id={`${rule.chapterNumber}.${rule.ruleNumber}`}>
            <li
              key={`r${rule.ruleNumber}`}
              className={`${styles.ruleText} list-group-item`}
            >
              {rule.chapterNumber}.{rule.ruleNumber} &nbsp;
                {parseLink({ routerValues, onLinkClick, rule })}
            </li>
          </section>
          <Example rule={rule} onLinkClick={onLinkClick} />
          <SubruleGroup rule={rule} subrules={subrules} onLinkClick={onLinkClick} />
        </div>
      ))}
    </div>
  );
};

export default RuleList;
