import { useState, FormEvent, ChangeEvent } from "react";
import styles from "../../../styles/SearchForm.module.scss";

interface Props {

}

const SearchForm = (props: Props): JSX.Element => {
  // const {

  // } = props;

  // Create local state to validate a submission
  const [query, setQuery] = useState();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Select element to return a custom validation message
    const input = document.getElementById(`${styles.search}`);

    // Reset to default or validation is wrong after going invalid > valid input
    input.setCustomValidity("");

  //   // Validate url
  //   const result = await validateUrl(url);
  //   // Set custom validation messages
  //   if (result === 0) {
  //     input.setCustomValidity(
  //       "Field empty! Please enter a valid ruleset link.",
  //     );
  //   } else if (result === 2) {
  //     input.setCustomValidity(
  //       "Invalid ruleset link! Please enter a valid link.",
  //     );
  //   } else if (result === 3) {
  //     input.setCustomValidity(
  //       "The rules found at this link are displayed below.",
  //     );
  //   } else if (result === 4) {
  //     input.setCustomValidity(
  //       "Alas, no ruleset was found at that link. Please try another.",
  //     );
  //   } else if (result === 1) {
  //     input.setCustomValidity("");
  //   }
  //   // Display custom validation message
  //   if (!input.checkValidity()) {
  //     input.reportValidity();
  //   }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Set value to state
    setSearch(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.inputContainer}>
        <input
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
