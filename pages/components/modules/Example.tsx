import React from "react";
import { Rule, Subrule } from "../../../app/types";
import styles from "../../../styles/Example.module.scss";

interface Props {
  rule?: Rule;
  subrule?: Subrule;
}

const Example = (props: Props): JSX.Element => {
  const { rule, subrule } = props;
  const data: Rule | Subrule = rule || subrule;

  return (
    <div>
      {data.example.map(
        (example, index) => data.example && (
          <li
            key={rule ? `rule-e${index}` : `subrule-e${index}`}
            className={`${styles.example} list-group-item`}
          >
            {example}
          </li>
        ),
      )}
    </div>
  );
};

export default Example;
