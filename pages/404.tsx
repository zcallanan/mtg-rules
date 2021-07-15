import styles from "../styles/Custom404.module.scss";

interface Props {
  reason: string;
  value: number;
}

const Custom404 = (props: Props): JSX.Element => {
  const { reason, value } = props;

  return (
    <div>
      {reason === "invalid-hash"
      && <div className={styles.nonChapter}>
        <h1>{`404 - Chapter ${value} was not found.`}</h1>
        <h4>{`Please update the "#${value}" in the url to a valid number, such as "#100".`}</h4>
      </div>
      }
    </div>
  );
};

export default Custom404;
