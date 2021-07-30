import { useEffect, useMemo, useState } from "react";
import useSearch from "../hooks/useSearch";
import objectArrayComparison from "../utils/object-array-comparison";
import { SearchData, SearchResults } from "../typing/types";

interface Props {
  setSearchData: (obj: SearchData) => void;
  setSearchResults: (obj: SearchResults) => void;
  searchResults: SearchResults;
  searchData: SearchData;
}

const SearchWrapper = (props: Props): JSX.Element => {
  const { setSearchData, setSearchResults, searchResults, searchData } = props;

  // Local state to track searchTerm
  const [resultTerm, setResultTerm] = useState<string>("");

  // Get new search results from useSearch hook
  const newResults: SearchResults = useSearch(searchData);

  // Memoize results
  const memoNewResults = useMemo(() => newResults, [newResults]);

  // Update dynamic page state if new results are different from dynamic page's search results
  useEffect(() => {
    // If it is the results for the search data and the rules results are different from what dynamic page has
    if (
      resultTerm !== memoNewResults.searchTerm &&
      searchData.searchTerm === memoNewResults.searchTerm &&
      !objectArrayComparison(
        memoNewResults.searchRules,
        searchResults.searchRules
      )
    ) {
      // Prevent results for the same search term to be saved consecutively
      setResultTerm(memoNewResults.searchTerm);

      // Save search results to dynamic page
      setSearchResults(memoNewResults);

      // Mark search as completed
      setSearchData({
        searchTerm: searchData.searchTerm,
        searchCompleted: 1,
        sections: searchData.sections,
        chapters: searchData.chapters,
        rules: searchData.rules,
        subrules: searchData.subrules,
      });
    }
  }, [
    setSearchResults,
    setSearchData,
    searchData.searchTerm,
    memoNewResults,
    searchResults.searchRules,
    resultTerm,
    searchData,
  ]);

  return null;
};

export default SearchWrapper;
