import { useEffect, useMemo } from "react";
import useSearch from "../hooks/useSearch";
import objectArrayComparison from "../utils/object-array-comparison";
import { SearchData, SearchResults } from "../typing/types";

interface Props {
  setSearchResults: (obj: SearchResults) => void;
  searchResults: SearchResults;
  searchData: SearchData;
}

const SearchWrapper = (props: Props): JSX.Element => {
  const {
    setSearchResults,
    searchResults,
    searchData,
  } = props;
  
  // Get new search results from useSearch hook
  const newResults: SearchResults = useSearch(searchData);
  // Memoize results
  const memoNewResults = useMemo(() => newResults, [newResults]);

  // Update dynamic page state if new results are different from dynamic page's search results
  useEffect(() => {
    if (
      searchData.searchTerm === memoNewResults.searchTerm 
      && !objectArrayComparison(memoNewResults.searchRules, searchResults.searchRules)
    ) {
      setSearchResults(memoNewResults);
    }
  }, [setSearchResults, searchData.searchTerm, memoNewResults, searchResults.searchRules]);

  return (null);
}

export default SearchWrapper;
