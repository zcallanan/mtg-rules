import styles from "../styles/NoSearchResults.module.scss";

interface Props {
  title: number;
}

const NoSearchResults = (props: Props): JSX.Element => {
  const { title } = props;

  return (
    <div>
      {title ? (
        <div className={styles.noTitleContainer}>
          <span className={styles.noTitle}>No Search Results!</span>
        </div>
      ) : (
        <div className={styles.noRulesContainer}>
          <span className={styles.noRules}>
            There was nothing to display. Please search for another term!
          </span>
        </div>
      )}
    </div>
  );
};

export default NoSearchResults;
