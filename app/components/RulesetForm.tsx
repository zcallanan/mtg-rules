import { useRef, useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter, NextRouter } from "next/router";
import formValidation from "../utils/form-validation";
import { RouterValues } from "../typing/types";
import styles from "../styles/RulesetForm.module.scss";

interface Props {
  smallText: string;
}

const RulesetForm = (props: Props): JSX.Element => {
  const { smallText } = props;

  // Create local state to validate a submission
  const [url, setUrl] = useState("");

  // Get url query values
  const router: NextRouter = useRouter();
  const year: string = Array.isArray(router.query.year)
    ? router.query.year[0]
    : router.query.year;
  const version: string = Array.isArray(router.query.version)
    ? router.query.version[0]
    : router.query.version;
  const routerValues: RouterValues = { year, version };
  const initUrl = `https://media.wizards.com/${routerValues.year}/downloads/MagicCompRules%${routerValues.version}.txt`;

  // Set initial url on page load
  useEffect(() => {
    setUrl(initUrl);
  }, [initUrl]);

  // Input element ref
  const input = useRef<HTMLInputElement>();

  const validateUrl = async (rulesetUrl: string): Promise<number> => {
    if (!rulesetUrl.length) {
      // If it is an empty string
      return 0;
    }

    // Get version and year from rulesetUrl link
    const reVersion = /\d{10}/;
    const versionUrl: string = reVersion.test(rulesetUrl)
      ? rulesetUrl.match(reVersion)[0]
      : "";
    const reYear = /\d{4}/;
    const yearUrl: string = reYear.test(rulesetUrl)
      ? rulesetUrl.match(reYear)[0]
      : "";

    // That ruleset is already displayed
    if (routerValues.version === versionUrl && routerValues.year === yearUrl) {
      return 3;
    }

    // Offload validation to util fn
    const result = await formValidation(rulesetUrl, versionUrl, yearUrl);
    // Change the displayed ruleset
    if (result === 200) {
      // Link validated, update router
      router.query.version = versionUrl;
      router.query.year = yearUrl;
      // Trigger ISR page update
      // TODO: Unknown key error in dev, although update works
      router.push(router);
      return 1;
    }
    // No data found at that link
    return 4;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Select element to return a custom validation message

    // Reset to default or validation is wrong after going invalid > valid input
    input.current.setCustomValidity("");

    // Validate url
    const result = await validateUrl(url);
    // Set custom validation messages
    if (result === 0) {
      input.current.setCustomValidity(
        "Field empty! Please enter a valid ruleset link."
      );
    } else if (result === 2) {
      input.current.setCustomValidity(
        "Invalid ruleset link! Please enter a valid link."
      );
    } else if (result === 3) {
      input.current.setCustomValidity(
        "The rules found at this link are displayed below."
      );
    } else if (result === 4) {
      input.current.setCustomValidity(
        "Alas, no ruleset was found at that link. Please try another."
      );
    } else if (result === 1) {
      input.current.setCustomValidity("");
    }
    // Display custom validation message
    if (!input.current.checkValidity()) {
      input.current.reportValidity();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Set value to state
    setUrl(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.inputContainer}>
        <input
          ref={input}
          onChange={handleChange}
          value={url}
          id={styles.input}
          type="text"
          className="form-control"
          required
        />
        <button
          className="btn btn-primary"
          id={styles.rulesetFormButton}
          type="submit"
        >
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
