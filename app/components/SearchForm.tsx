import {
  useState,
  useRef,
  useMemo,
  useEffect,
  FormEvent,
  ChangeEvent,
} from "react";
import { SearchValue } from "../typing/types";
import styles from "../styles/SearchForm.module.scss";

interface Props {
  onSearch: (obj: SearchValue) => void;
}

const SearchForm = (props: Props): JSX.Element => {
  const { onSearch } = props;

  // Input ref
  const input = useRef<HTMLInputElement>();

  // Create local state
  const [searchValue, setSearch] = useState<SearchValue>({
    searchTerm: "",
    submitted: 0,
    validated: 0,
  });

  // Deconstruct searchValue
  const { searchTerm, submitted, validated } = searchValue;

  // Create searchValue fn for memoization
  const createSearchValue = (a: string, b: number, c: number) => ({
    searchTerm: a,
    submitted: b,
    validated: c
  });
 
  // Cache searchValue
  const memoizedSearchValue = useMemo(() => createSearchValue(
    searchTerm, submitted, validated), [searchTerm, submitted, validated]);

  // Pass memoized searchValue to dynamic page
  useEffect(() => {
    // If a search term is validated, pass it to parent and mark submitted
    if (
      memoizedSearchValue.searchTerm
      && memoizedSearchValue.validated
      && !memoizedSearchValue.submitted
    ) {
      onSearch(memoizedSearchValue);
      setSearch((prevValue) => ({
        ...prevValue,
        submitted: 1,
      }))
    }
  }, [onSearch, memoizedSearchValue])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Reset to default or validation is wrong after going invalid > valid input
    input.current.setCustomValidity("");

    if (!searchValue.searchTerm) {
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
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Set searchValue to state
    setSearch({
      searchTerm: e.target.value,
      submitted: 0,
      validated: 0,
    })
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.inputContainer}>
        <input
          ref={input}
          onChange={handleChange}
          id={styles.input}
          type="text"
          className="form-control"
        />
        <button className="btn btn-primary" id={styles.button} type="submit">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
