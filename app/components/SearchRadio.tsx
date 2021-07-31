import { MutableRefObject, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/SearchType.module.scss";

interface Props {
  radioChange: (e: ChangeEvent<HTMLInputElement>) => void;
  partialChecked: MutableRefObject<boolean>;
  exactChecked: MutableRefObject<boolean>;
}

const SearchRadio = (props: Props): JSX.Element => {
  const { radioChange, partialChecked, exactChecked } = props;

  return (
    <div className={styles.radiosContainer}>
      <div className={`${styles.partialRadioContainer} form-check`}>
        <input
          className="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id={styles.partialRadio}
          value="partial"
          onChange={radioChange}
          checked={partialChecked.current}
        />
        <label
          className={`${styles.radioLabel} form-check-label`}
          htmlFor="partialRadio"
        >
          Partial Match
        </label>
        <div title="partial info text" className={styles.radioIcon}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
      </div>
      <div className={`${styles.exactRadioContainer} form-check`}>
        <input
          className="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id={styles.exactRadio}
          value="exact"
          onChange={radioChange}
          checked={exactChecked.current}
        />
        <label
          className={`${styles.radioLabel} form-check-label`}
          htmlFor="exactRadio"
        >
          Exact Match
        </label>
        <div title="exact info text" className={styles.radioIcon}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
      </div>
    </div>
  );
};

export default SearchRadio;
