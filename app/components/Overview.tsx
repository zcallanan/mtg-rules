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
  const { version, year } = useRouter().query;

  const type = searchResults.searchType === "partial" ? "Partial" : "Exact";

  return (
    <div className={styles.overviewContents}>
      {!!searchResults.searchResult &&
        !searchData.searchCompleted &&
        !!nodes.rules.length && (
          <h6>{`Full rule set ${version} from ${year}.`}</h6>
        )}
      {!!searchData.searchCompleted && !!searchResults.searchResult && (
        <h6>{`${type} Match for rule set ${version} from ${year}.`}</h6>
      )}
      <span className={styles.effectiveDate}>
        <h6>{`Effective: ${effectiveDate}`}</h6>
      </span>
    </div>
  );
};

export default Overview;
