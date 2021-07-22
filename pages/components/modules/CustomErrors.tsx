import { useState, useEffect } from "react";
import Custom404 from "../../404";
import { Nodes, Chapter, ErrorData } from "../../../app/types";

interface Errors {
  nodes?: Nodes;
  validChapter?: Chapter | undefined;
}

interface Props {
  data: Errors;
  chapterNumber?: number;
}

const CustomErrors = ((props: Props): JSX.Element | void => {
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
