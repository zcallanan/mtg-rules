import React from "react";
import SubruleGroup from "./SubruleGroup";
import Example from "./Example";
import { Rule, Subrule } from "../../../app/types";
import styles from "../../../styles/RuleList.module.scss";

interface Props {
  ruleSubset: Rule[];
  subrules: Subrule[];
}

const RuleList = (props: Props): JSX.Element => {
  const { ruleSubset, subrules } = props;

  return (
    <div>
      {ruleSubset.map((rule, index) => (
        <div key={`d-${index}`}>
          <li
            key={`r${rule.ruleNumber}`}
            className={`${styles.ruleText} list-group-item`}
          >
            {rule.chapterNumber}.{rule.ruleNumber} &nbsp; {rule.text}
          </li>
          <Example rule={rule} />
          <SubruleGroup rule={rule} subrules={subrules} />
        </div>
      ))}
    </div>
  );
};

export default RuleList;
