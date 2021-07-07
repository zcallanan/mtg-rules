import React from "react";
import Example from "./Example";
import { Subrule } from "../../../app/types";
import styles from "../../../styles/SubruleList.module.scss";

interface Props {
  subruleSubset: Subrule[];
}

const SubruleList = (props: Props): JSX.Element => {
  const { subruleSubset } = props;

  return (
    <div>
      {subruleSubset.map((subrule, index) => (
        <div key={`dv${index}`}>
          <li
            key={`subr-${index}`}
            className={`${styles.subruleText} list-group-item`}
          >
            {subrule.chapterNumber}.{subrule.ruleNumber}
            {subrule.subruleLetter} &nbsp; {subrule.text}
          </li>
          <Example subrule={subrule} />
        </div>
      ))}
    </div>
  );
};

export default SubruleList;
