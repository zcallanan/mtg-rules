import React from "react";
import { useRouter } from "next/router";
import formValidation from "../../../app/form-validation";
import styles from "../../../styles/RulesetForm.module.scss";

interface Props {
  initialUrl: string;
  smallText: string;
}

const RulesetForm = (props: Props): JSX.Element => {
  const {
    initialUrl,
    smallText,
  } = props;

  // Create local state to validate a submission
  const [url, setUrl] = React.useState(initialUrl);
  const router = useRouter();

  const routerValues: RouterValues = {
    year: router.query.year,
    version: router.query.version,
  };

  const validateUrl = async (rulesetUrl: string): Promise<number> => {
    if (!rulesetUrl.length) {
      // If it is an empty string
      return 0;
    }

    // Get version and year from rulsetUrl link
    const reVersion = /\d{10}/;
    const version: number = reVersion.test(rulesetUrl) ? rulesetUrl.match(reVersion)[0] : 0;
    const reYear = /\d{4}/;
    const year: number = reYear.test(rulesetUrl) ? rulesetUrl.match(reYear)[0] : 0;

    // That ruleset is already displayed
    if (routerValues.version === version && routerValues.year === year) {
      return 3;
    }

    // Offload validation to util fn
    const result = await formValidation(rulesetUrl, version, year);
    // Change the displayed ruleset
    if (result === 200) {
      // Link validated, update router
      router.query.version = version;
      router.query.year = year;
      // Trigger ISR page update
      // TODO: Unknown key error in dev, although update works
      router.push(router);
      return 1;
    }
    // No data found at that link
    return 4;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Select element to return a custom validation message
    const input = document.getElementById(`${styles.ruleset}`);

    // Reset to default or validation is wrong after going invalid > valid input
    input.setCustomValidity("");

    // Validate url
    const result = await validateUrl(url);
    // Set custom validation messages
    if (result === 0) {
      input.setCustomValidity(
        "Field empty! Please enter a valid ruleset link.",
      );
    } else if (result === 2) {
      input.setCustomValidity(
        "Invalid ruleset link! Please enter a valid link.",
      );
    } else if (result === 3) {
      input.setCustomValidity(
        "The rules found at this link are displayed below.",
      );
    } else if (result === 4) {
      input.setCustomValidity(
        "Alas, no ruleset was found at that link. Please try another.",
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
      <div className={styles.inputContainer}>
        <input
          onChange={handleChange}
          value={url}
          id={styles.input}
          type="text"
          className="form-control"
          required
        />
        <button className="btn btn-primary" id={styles.button} type="submit">
          Get Rules
        </button>
      </div>
      <small id={styles.helpText} className="form-text text-muted">
        {smallText}
      </small>
    </form>
  );
};

export default RulesetForm;
