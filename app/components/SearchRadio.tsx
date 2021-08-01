import { MutableRefObject, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/SearchRadio.module.scss";

interface Props {
  radioChange: (e: ChangeEvent<HTMLInputElement>) => void;
  partialChecked?: MutableRefObject<boolean>;
  exactChecked?: MutableRefObject<boolean>;
  type: string;
}

const SearchRadio = (props: Props): JSX.Element => {
  const { radioChange, partialChecked, exactChecked, type } = props;

  return (
    <div
      className={`${
        type === "partial"
          ? styles.partialRadioContainer
          : styles.exactRadioContainer
      } form-check`}
    >
      <input
        className="form-check-input"
        type="radio"
        name="inlineRadioOptions"
        id={type === "partial" ? styles.partialRadio : styles.exactRadio}
        value="partial"
        onChange={radioChange}
        checked={
          type === "partial" ? partialChecked.current : exactChecked.current
        }
      />
      <label
        className={`${styles.radioLabel} form-check-label`}
        htmlFor={type === "partial" ? "partialRadio" : "exactRadio"}
      >
        {type === "partial" ? "Partial Match" : "Exact Match"}
      </label>
      <div
        title={
          type === "partial"
            ? "Case insensitive search that returns all occurrences of the searched term."
            : "Case sensitive search that returns exact instances of the searched term."
        }
        className={styles.radioIcon}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </div>
    </div>
  );
};

export default SearchRadio;
