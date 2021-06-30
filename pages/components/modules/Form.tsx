import React from 'react';
import { SectionI, ChapterI } from '../../../app/types.ts';
import styles from '../../../styles/Form.module.scss';

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

  // React.useEffect(() => {

  // },[])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    /*
      Grab value to be validated from local state
      Call prop to validate
      Is it in url format?
      Ends with .txt?
      Is it to the right pathname "https://media.wizards.com/XX/downloads/MagicCompRules%/XX.txt"
      Does fetch get a text response?
      Then update router
    */

    e.preventDefault();
    // Validate url
    const result: number = validateUrl(url);
    // If result is not 1, then its an input error
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Set value to state
    setUrl(e.target.value);
  };

  return (
    <div className="form-fields">
      <div className="form-group">
        <form onSubmit={handleSubmit}>
          <label htmlFor="searchInput" className={styles.searchLabel}>{formText}</label>
          <input
            onChange={handleChange}
            value={url}
            id={styles.searchInput}
            type="text"
            className="form-control"
            required
          />
          <small id={styles.helpText} className="form-text text-muted">
            {smallText}
          </small>
          <button className="btn btn-primary" type="submit">Click</button>
        </form>
      </div>
    </div>
  )
};

export default Form;
