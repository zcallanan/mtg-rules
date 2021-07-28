import {
  useState,
  useRef,
  useMemo,
  useEffect,
  FormEvent,
  ChangeEvent,
  MouseEvent,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import {
  SearchData,
  SearchResults,
  SearchValue,
  Section,
  Chapter,
  Rule,
  Subrule,
} from "../typing/types";
import styles from "../styles/SearchForm.module.scss";


interface Props {
  setSearchData: (obj: SearchData) => void;
  setSearchResults: (obj: SearchResults) => void;
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
  const [searchValue, setSearch] = useState<SearchValue>({
    searchTerm: "",
    submitted: 0,
    validated: 0,
    reset: 0,
  });

  // Deconstruct searchValue
  const { searchTerm, submitted, validated, reset } = searchValue;

  // Create searchValue fn for memoization
  const createSearchValue = (a: string, b: number, c: number, d: number) => ({
    searchTerm: a,
    submitted: b,
    validated: c,
    reset: d,
  });
 
  // Cache searchValue
  const memoSearchValue = useMemo(() => createSearchValue(
    searchTerm, submitted, validated, reset), [searchTerm, submitted, validated, reset]);

  // Pass memoized searchValue to dynamic page
  useEffect(() => {
    /* 
      If a search term is validated, pass it to parent and mark submitted
      OR
      The form was reset, tell the dynamic page to clear search state
    */
    if (
      (
        memoSearchValue.validated
        && !memoSearchValue.submitted 
        || (
            memoSearchValue.reset && memoSearchValue.validated && !memoSearchValue.submitted
        )
      )
    ) {
    if (memoSearchValue.reset || (!memoSearchValue.searchTerm && searchedTerm)) {
        // If search form cancel button is clicked OR an empty form is submitted:
        // Clear dynamic page search data
        setSearchData({
          searchTerm: "",
          sections: [],
          chapters: [],
          rules: [],
          subrules: [],
        })
      } else if (searchedTerm !== memoSearchValue.searchTerm) {
        // Save search data
        setSearchData({
          searchTerm: memoSearchValue.searchTerm,
          sections,
          chapters,
          rules,
          subrules,
        })
      }

      // The user may have searched previously. Clear dynamic page search results
      setSearchResults({
        searchTerm: "",
        searchSections: [],
        searchChapters: [],
        searchRules: [],
        searchSubrules: [],
        searchResult: 0,
      });


      // Mark local searchValue as submitted
      setSearch((prevValue) => ({
        ...prevValue,
        submitted: 1,
      }))
    }
  }, [
    memoSearchValue,
    searchedTerm,
    setSearchData,
    setSearchResults,
    sections,
    chapters,
    rules,
    subrules
  ])

  const validateSearchInput = () => {
    // Reset to default or validation is wrong after going invalid > valid input
    input.current.setCustomValidity("");

    // If dynamic page has no search values and an empty search is made, fail validation
    if (
      !searchValue.searchTerm 
      && searchValue.searchTerm === searchedTerm
      && !searchValue.reset
    ) {
      input.current.setCustomValidity(
        "Field empty! Please enter a value to search for.",
      );
      // Display error message
      if (!input.current.checkValidity()) {
        input.current.reportValidity();
      }
    } else {
      // There is a search value, mark validated
      setSearch((prevValue) => ({
        ...prevValue,
        validated: 1,
      }))
    }
  }

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
    setSearch({
      searchTerm: "",
      submitted: 0,
      validated: 1,
      reset: 1,
    })
  }

  // The form input value changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // onChange, save input searchTerm to state
    setSearch({
      searchTerm: e.target.value,
      submitted: 0,
      validated: 0,
      reset: 0,
    })
  };

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
    </form>
  );
};

export default SearchForm;
