import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Custom404 from "../../404";
import { Nodes, Chapter } from "../../../app/types";

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
  const [values, setValues] = useState({ reason: "", value: null });

  useEffect(() => {
    console.log("customErrors")
    if (data.nodes && !data.nodes.length) {
      console.log("custom error nodes")
      setValues((prevValue) => ({
        ...prevValue,
        reason: "ruleset-fetch-failed",
      }));
    } else if (!data.validChapter) {
      console.log("invalid-hash")
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
