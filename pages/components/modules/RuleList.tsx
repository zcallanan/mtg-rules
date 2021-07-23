import { RefObject } from "react";
import { useRouter, NextRouter } from "next/router";
import SubruleGroup from "./SubruleGroup";
import Example from "./Example";
import parseLink from "../../../app/parse-link";
import { Rule, Subrule, RouterValues } from "../../../app/types";
import styles from "../../../styles/RuleList.module.scss";

interface Props {
  ruleSubset: Rule[];
  subrules: Subrule[];
  elRef: (node: RefObject<HTMLDivElement>) => void | null;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
}

const RuleList = (props: Props): JSX.Element => {
  const {
    ruleSubset,
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
        <div key={`ruleListDiv-${index}`} className={styles.ruleDiv} ref={elRef}>
          <section id={`${rule.chapterNumber}.${rule.ruleNumber}`}>
            <li
              key={`r${rule.ruleNumber}`}
              className={`${styles.ruleText} list-group-item`}
            >
              {rule.chapterNumber}.{rule.ruleNumber} &nbsp; {parseLink(
                rule,
                routerValues,
                onLinkClick,
              )}
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
