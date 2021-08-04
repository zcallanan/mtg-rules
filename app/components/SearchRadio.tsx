import { ChangeEvent, MouseEvent } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/SearchRadio.module.scss";

interface Props {
  radioChange: (e: ChangeEvent<HTMLInputElement>) => void;
  updateFromLabel: (s: string) => void;
  partialChecked: boolean;
  exactChecked: boolean;
  type: string;
}

const SearchRadio = (props: Props): JSX.Element => {
  const { radioChange, updateFromLabel, partialChecked, exactChecked, type } =
    props;

  // If you click the label, pass the label string to SearchForm
  const labelClicked = (e: MouseEvent<HTMLLabelElement>) => {
    // Cast target for TypeScript
    const target = e.target as HTMLLabelElement;

    if (target.htmlFor === "partial") {
      updateFromLabel(target.htmlFor);
    } else if (target.htmlFor === "exact") {
      updateFromLabel(target.htmlFor);
    }
  };

  const handleEntering = (d: HTMLDivElement): void => {
    // Cast div.arrow
    const child1 = d.children[0] as HTMLDivElement;
    // Cast div.tooltip-inner
    const child2 = d.children[1] as HTMLDivElement;
    // Add styling to tooltip
    child1.style.borderTopColor = "#03045e";
    child2.style.opacity = "1";
    child2.style.backgroundColor = "#03045e";
  };

  return (
    <div
      className={`${
        type === "partial"
          ? styles.partialRadioContainer
          : styles.exactRadioContainer
      } form-check`}
    >
      <input
        className={`form-check-input ${styles.radioInput}`}
        type="radio"
        name="inlineRadioOptions"
        id={type === "partial" ? styles.partial : styles.exact}
        value={type === "partial" ? "partial" : "exact"}
        onChange={radioChange}
        checked={type === "partial" ? partialChecked : exactChecked}
      />
      <label
        className={`${styles.radioLabel} form-check-label`}
        htmlFor={type === "partial" ? "partial" : "exact"}
        onClick={labelClicked}
      >
        {type === "partial" ? "Partial Match" : "Exact Match"}
      </label>

      <OverlayTrigger
        key="bottom"
        placement="bottom"
        onEntering={handleEntering}
        overlay={
          <Tooltip id={styles.radioTooltip}>
            {type === "partial"
              ? "Case insensitive search that returns all occurrences of the searched term."
              : "Case sensitive search that returns only exact instances of the searched term."}
          </Tooltip>
        }
      >
        <div className={styles.radioIcon}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default SearchRadio;
