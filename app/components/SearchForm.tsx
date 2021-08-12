import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  memo,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchRadio from "./SearchRadio";
import {
  Chapter,
  RadioCheck,
  Rule,
  SearchData,
  SearchFormValue,
  SearchResults,
  Section,
  Subrule,
} from "../typing/types";
import styles from "../styles/SearchForm.module.scss";

interface Props {
  chapters: Chapter[];
  rules: Rule[];
  searchResults: SearchResults;
  sections: Section[];
  setSearchData: Dispatch<SetStateAction<SearchData>>;
  setSearchResults: Dispatch<SetStateAction<SearchResults>>;
  subrules: Subrule[];
}

const SearchForm = (props: Props): JSX.Element => {
  // Destructure props
  const {
    chapters,
    rules,
    searchResults,
    sections,
    setSearchData,
    setSearchResults,
    subrules,
  } = props;

  const searchedTerm = searchResults.searchTerm;
  const searchedType = searchResults.searchType;

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

  const [radioCheck, setRadioCheck] = useState<RadioCheck>({
    partial: false,
    exact: false,
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
      - If a search term is validated, pass it to parent and mark submitted
      OR
      - The form was reset, tell the dynamic page to clear search state
    */
    if (memoSearchValue.validated && !memoSearchValue.submitted) {
      if (!memoSearchValue.searchTerm && searchedTerm) {
        // If search form cancel button is clicked OR an empty form is submitted:
        // Clear dynamic page search data
        setSearchData((prevValue) => ({
          ...prevValue,
          chapters: [],
          previousSearchTerm: searchedTerm,
          rules: [],
          searchCleared: 1,
          searchCompleted: 0,
          searchTerm: "",
          sections: [],
          subrules: [],
        }));

        // The user may have searched previously. Clear dynamic page search results
        setSearchResults({
          searchChapters: [],
          searchResult: 1,
          searchRules: [],
          searchSections: [],
          searchSubrules: [],
          searchTerm: "",
          searchType: "",
        });
      } else if (
        searchedType !== memoSearchValue.searchType ||
        searchedTerm !== memoSearchValue.searchTerm
      ) {
        /*
          - If different search types but same term, do the search
          - If the same search types but different terms, do the search
          - If the same types and same term, don't do the search 
        */

        setSearchData((prevValue) => ({
          ...prevValue,
          chapters,
          rules,
          searchCleared: 0,
          searchCompleted: 0,
          searchTerm: memoSearchValue.searchTerm,
          searchType: memoSearchValue.searchType,
          sections,
          subrules,
        }));
      }

      // Mark local searchValue as submitted
      setSearchValue((prevValue) => ({
        ...prevValue,
        submitted: 1,
      }));
    }
  }, [
    chapters,
    memoSearchValue,
    rules,
    searchedTerm,
    searchedType,
    sections,
    setSearchData,
    setSearchResults,
    subrules,
  ]);

  const validateSearchInput = useCallback(() => {
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
  }, [searchValue.searchTerm, searchedTerm]);

  // The form was submitted
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      validateSearchInput();
    },
    [validateSearchInput]
  );

  // The X was clicked
  const handleCancel = useCallback((e: MouseEvent<HTMLButtonElement>): void => {
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
  }, []);

  // The form input value changes
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      // onChange, save input searchTerm to state
      if (searchValue.searchTerm !== e.target.value) {
        setSearchValue((prevValue) => ({
          ...prevValue,
          searchTerm: e.target.value,
          submitted: 0,
          validated: 0,
        }));
      }
    },
    [searchValue.searchTerm]
  );

  const radioChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      // Save search type from radio button toggle
      if (searchValue.searchType !== e.target.value) {
        setSearchValue((prevValue) => ({
          ...prevValue,
          searchType: e.target.value,
          submitted: 0,
          validated: 0,
        }));
      }
      // Toggle radio button checked
      if (e.target.value === "exact" && !radioCheck.exact) {
        setRadioCheck({
          exact: true,
          partial: false,
        });
      } else if (e.target.value === "partial" && !radioCheck.partial) {
        setRadioCheck({
          exact: false,
          partial: true,
        });
      }
    },
    [radioCheck.exact, radioCheck.partial, searchValue.searchType]
  );

  // Prop for SearchRadio label to toggle radio selection
  const updateFromLabel = useCallback(
    (s: string): void => {
      // Save search type from clicking on label
      if (searchValue.searchType !== s) {
        setSearchValue((prevValue) => ({
          ...prevValue,
          searchType: s,
        }));
      }
      // Toggle radio button checked
      if (s === "partial" && !radioCheck.partial) {
        setRadioCheck({
          exact: false,
          partial: true,
        });
      } else if (s === "exact" && !radioCheck.exact) {
        setRadioCheck({
          exact: true,
          partial: false,
        });
      }
    },
    [radioCheck.exact, radioCheck.partial, searchValue.searchType]
  );

  // Select partial search radio button on first page load
  useEffect(() => {
    setRadioCheck({
      partial: true,
      exact: false,
    });
  }, []);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.inputContainer}>
        <div className={styles.searchField}>
          <input
            ref={input}
            onChange={handleChange}
            id={styles.searchInput}
            type="text"
            className="form-control"
          />
          <button
            type="button"
            className="btn btn-outline-primary"
            id={styles.cancelFormButton}
            ref={cancel}
            onClick={handleCancel}
          >
            <div className={styles.searchIcon}>
              <FontAwesomeIcon icon="times" />
            </div>
          </button>
          <button
            className="btn btn-primary"
            id={styles.searchFormButton}
            type="submit"
          >
            <div className={styles.searchIcon}>
              <FontAwesomeIcon icon="search" />
            </div>
          </button>
        </div>
      </div>
      <div className={styles.radiosContainer}>
        <SearchRadio
          radioChange={radioChange}
          updateFromLabel={updateFromLabel}
          partialChecked={radioCheck.partial}
          exactChecked={radioCheck.exact}
          type={"partial"}
        />
        <SearchRadio
          radioChange={radioChange}
          updateFromLabel={updateFromLabel}
          partialChecked={radioCheck.partial}
          exactChecked={radioCheck.exact}
          type={"exact"}
        />
      </div>
    </form>
  );
};

export default memo(SearchForm);
