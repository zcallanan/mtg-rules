import { useRouter } from "next/router";
import { SearchResults, SearchData, RulesParse } from "../typing/types";
import styles from "../styles/Overview.module.scss";

interface Props {
  searchData: SearchData;
  searchResults: SearchResults;
  nodes: RulesParse;
  effectiveDate: string;
}

const Overview = (props: Props): JSX.Element => {
  const { searchData, searchResults, nodes, effectiveDate } = props;
  const { version } = useRouter().query;

  const type = searchResults.searchType === "partial" ? "Partial" : "Exact";

  return (
    <div className={styles.overviewPane}>
      {!!searchResults.searchResult &&
        !searchData.searchCompleted &&
        !!nodes.rules.length && (
          <span className={styles.overviewText}>
            {`Full rule set ${version}`}
          </span>
        )}
      {!!searchData.searchCompleted && !!searchResults.searchResult && (
        <span className={styles.overviewText}>
          {`${type} Match for rule set ${version}`}
        </span>
      )}
      {searchData.searchTerm &&
      !searchResults.searchResult &&
      searchData.searchCompleted ? (
        <span className={styles.alas}>Alas!</span>
      ) : (
        <span id={styles.effectiveDate}>{`• Effective: ${effectiveDate}`}</span>
      )}
    </div>
  );
};

export default Overview;
