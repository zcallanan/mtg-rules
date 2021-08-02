import { useRouter } from "next/router";
import { SearchResults, SearchData, RulesParse } from "../typing/types";

interface Props {
  searchData: SearchData;
  searchResults: SearchResults;
  nodes: RulesParse;
}

const Overview = (props: Props): JSX.Element => {
  const { searchData, searchResults, nodes } = props;
  const { version, year } = useRouter().query;

  const type = searchResults.searchType === "partial" ? "Partial" : "Exact";

  return (
    <div>
      {!!searchResults.searchResult &&
        !searchData.searchCompleted &&
        !!nodes.rules.length && (
          <h6>{`Full rule set ${version} from ${year}.`}</h6>
        )}
      {!!searchData.searchCompleted && !!searchResults.searchResult && (
        <h6>{`${type} Match for rule set ${version} from ${year}.`}</h6>
      )}
    </div>
  );
};

export default Overview;
