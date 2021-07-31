import {
  useState,
  useRef,
  useMemo,
  useEffect,
  FormEvent,
  ChangeEvent,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import SearchRadio from "./SearchRadio";
import {
  SearchData,
  SearchResults,
  SearchFormValue,
  Section,
  Chapter,
  Rule,
  Subrule,
} from "../typing/types";
import styles from "../styles/SearchForm.module.scss";

interface Props {
  setSearchData: Dispatch<SetStateAction<SearchData>>;
  setSearchResults: Dispatch<SetStateAction<SearchResults>>;
  searchedTerm: string;
  sections: Section[];
  chapters: Chapter[];
  rules: Rule[];
  subrules: Subrule[];
}

const SearchForm = (props: Props): JSX.Element => {
  const {
    setSearchData,
    setSearchResults,
    searchedTerm,
    sections,
    chapters,
    rules,
    subrules,
  } = props;

  // Input ref
  const input = useRef<HTMLInputElement>();

  // Cancel ref
  const cancel = useRef<HTMLButtonElement>();

  // Create local state
  const [searchValue, setSearchValue] = useState<SearchFormValue>({
    searchTerm: "",
    searchType: "partial",
    submitted: 0,
    validated: 0,
  });

  // Deconstruct searchFormValue
  const { searchTerm, searchType, submitted, validated } = searchValue;

  // Create searchValue fn for memoization
  const createSearchValue = (a: string, b: string, c: number, d: number) => ({
    searchTerm: a,
    searchType: b,
    submitted: c,
    validated: d,
  });

  // Cache searchValue
  const memoSearchValue = useMemo(
    () => createSearchValue(searchTerm, searchType, submitted, validated),
    [searchTerm, searchType, submitted, validated]
  );

  // Pass memoized searchValue to dynamic page
  useEffect(() => {
    /* 
      If a search term is validated, pass it to parent and mark submitted
      OR
      The form was reset, tell the dynamic page to clear search state
    */
    if (memoSearchValue.validated && !memoSearchValue.submitted) {
      if (!memoSearchValue.searchTerm && searchedTerm) {
        // If search form cancel button is clicked OR an empty form is submitted:
        // Clear dynamic page search data
        setSearchData((prevValue) => ({
          ...prevValue,
          searchTerm: "",
          searchCompleted: 0,
          sections: [],
          chapters: [],
          rules: [],
          subrules: [],
        }));
        // The user may have searched previously. Clear dynamic page search results
        setSearchResults({
          searchTerm: "",
          searchSections: [],
          searchChapters: [],
          searchRules: [],
          searchSubrules: [],
          searchResult: 1,
        });
      } else if (searchedTerm !== memoSearchValue.searchTerm) {
        // Save search data
        setSearchData({
          searchTerm: memoSearchValue.searchTerm,
          searchCompleted: 0,
          searchType: memoSearchValue.searchType,
          sections,
          chapters,
          rules,
          subrules,
        });
      }

      // Mark local searchValue as submitted
      setSearchValue((prevValue) => ({
        ...prevValue,
        submitted: 1,
      }));
    }
  }, [
    memoSearchValue,
    searchedTerm,
    setSearchData,
    setSearchResults,
    sections,
    chapters,
    rules,
    subrules,
  ]);

  const validateSearchInput = () => {
    // Reset to default or validation is wrong after going invalid > valid input
    input.current.setCustomValidity("");

    // If dynamic page has no search values and an empty search is made, fail validation
    if (!searchValue.searchTerm && searchValue.searchTerm === searchedTerm) {
      input.current.setCustomValidity(
        "Field empty! Please enter a value to search for."
      );
      // Display error message
      if (!input.current.checkValidity()) {
        input.current.reportValidity();
      }
    } else {
      // There is a search value, mark validated
      setSearchValue((prevValue) => ({
        ...prevValue,
        validated: 1,
      }));
    }
  };

  // The form was submitted
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    validateSearchInput();
  };

  // The X was clicked
  const handleCancel = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    // Clear the input
    input.current.value = "";

    // Trigger submitting reset to dynamic page - this prompts clearing of search results
    setSearchValue((prevValue) => ({
      ...prevValue,
      searchTerm: "",
      submitted: 0,
      validated: 1,
    }));
  };

  // The form input value changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // onChange, save input searchTerm to state
    if (searchValue.searchTerm !== e.target.value) {
      setSearchValue((prevValue) => ({
        ...prevValue,
        searchTerm: e.target.value,
        submitted: 0,
        validated: 0,
      }));
    }
  };

  // Store radio button toggle values in refs
  const exactChecked = useRef<boolean>(false);
  const partialChecked = useRef<boolean>(false);

  const radioChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Save search type from radio button toggle
    if (searchValue.searchType !== e.target.value) {
      setSearchValue((prevValue) => ({
        ...prevValue,
        searchType: e.target.value,
      }));
    }
    // Toggle radio button checked
    if (e.target.value === "exact" && partialChecked.current) {
      partialChecked.current = false;
      exactChecked.current = true;
    } else if (e.target.value === "partial" && exactChecked.current) {
      partialChecked.current = true;
      exactChecked.current = false;
    }
  };

  // Check partial search radio button on first page load
  useEffect(() => {
    if (!partialChecked.current) {
      partialChecked.current = true;
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.inputContainer}>
        <div className={styles.searchField}>
          <input
            ref={input}
            onChange={handleChange}
            id={styles.input}
            type="text"
            className="form-control"
          />
          <button
            type="button"
            className="btn btn-outline-primary"
            id={styles.timesCircle}
            ref={cancel}
            onClick={handleCancel}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        </div>
        <button className="btn btn-primary" id={styles.button} type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      <SearchRadio
        radioChange={radioChange}
        partialChecked={partialChecked}
        exactChecked={exactChecked}
      />
    </form>
  );
};

export default SearchForm;
