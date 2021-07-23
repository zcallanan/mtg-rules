import { useState, useEffect } from "react";
import Custom404 from "../../404";
import {
  Section,
  Chapter,
  Rule,
  Subrule,
  ErrorData
} from "../../../app/types";

interface Errors {
  nodes?: (Section | Chapter | Rule | Subrule)[];
  validChapter?: Chapter | undefined;
}

interface Props {
  data: Errors;
  chapterNumber?: number;
}

const CustomErrors = ((props: Props): JSX.Element => {
  const { data, chapterNumber } = props;
  const [values, setValues] = useState<ErrorData>({ reason: "", value: null });

  useEffect(() => {
    if (data.nodes && !data.nodes.length) {
      setValues((prevValue) => ({
        ...prevValue,
        reason: "ruleset-fetch-failed",
      }));
    } else if (!data.validChapter) {
      setValues({ reason: "invalid-hash", value: chapterNumber });
    }
  }, [chapterNumber, data]);

  return (
    <div>
      { values.reason
        && <Custom404 reason={values.reason} value={values.value}/>
      }
    </div>
  );
});

export default CustomErrors;
