import { useRouter } from "next/router";
import { SearchResults, SearchData } from "../typing/types";

interface Props {
  searchData: SearchData;
  searchResults: SearchResults;
}

const SearchOverview = (props: Props): JSX.Element => {
  const { searchData, searchResults } = props;
  const { version, year } = useRouter().query;

  return (
    <div>
        
    </div>
  )
};

export default SearchOverview;
