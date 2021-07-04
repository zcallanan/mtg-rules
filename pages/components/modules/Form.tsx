import React from "react";
import styles from "../../../styles/Form.module.scss";

interface Props {
  initialUrl: string;
  validateUrl: (url: string) => number;
  formText: string;
  smallText: string;
}

const Form = (props: Props): JSX.Element => {
  const { initialUrl, validateUrl, formText, smallText } = props;

  // Create local state to validate a submission
  const [url, setUrl] = React.useState(initialUrl);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Select element to return a custom validation message
    const input = document.getElementById(`${styles.ruleset}`);

    // Reset to default or validation is wrong after going invalid > valid input
    input.setCustomValidity("");

    // Validate url
    const result: number = validateUrl(url);
    // Set custom validation messages
    if (result === 0) {
      input.setCustomValidity(
        "Field empty! Please enter a valid ruleset link."
      );
    } else if (result === 2) {
      input.setCustomValidity(
        "Invalid ruleset link! Please enter a valid link."
      );
    } else if (result === 3) {
      input.setCustomValidity(
        "The rules found at this link are displayed below."
      );
    } else if (result === 4) {
      input.setCustomValidity(
        "Alas, no ruleset was found at that link. Please try another."
      );
    } else if (result === 1) {
      input.setCustomValidity("");
    }
    // Display custom validation message
    if (!input.checkValidity()) {
      input.reportValidity();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Set value to state
    setUrl(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="ruleset" className={styles.searchLabel}>
        {formText}
      </label>
      <input
        onChange={handleChange}
        value={url}
        id={styles.ruleset}
        type="text"
        className="form-control"
        required
      />
      <small id={styles.helpText} className="form-text text-muted">
        {smallText}
      </small>
      <button className="btn btn-primary" type="submit">
        Click
      </button>
    </form>
  );
};

export default Form;
