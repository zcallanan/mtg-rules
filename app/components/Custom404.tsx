import { memo } from "react";
import styles from "../styles/Custom404.module.scss";
import { ErrorData } from "../typing/types";

const Custom404 = (props: ErrorData): JSX.Element => {
  const { reason, value } = props;

  return (
    <div className={styles.errorContent}>
      {reason === "invalid-hash" && (
        <div>
          <h1>{`404 - Chapter ${value} was not found.`}</h1>
          <h4>{`Please update "#${value}" in the url to a valid number, such as "#100".`}</h4>
        </div>
      )}
      {reason === "ruleset-fetch-failed" && (
        <div>
          <h1>{"404 - The rule set data was not found."}</h1>
        </div>
      )}
    </div>
  );
};

export default memo(Custom404);
