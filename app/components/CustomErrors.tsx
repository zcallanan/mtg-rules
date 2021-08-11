import { useState, useEffect, memo } from "react";
import Custom404 from "./Custom404";
import { ErrorData, ValidateChapter } from "../typing/types";

interface Props {
  data: ValidateChapter;
  chapterNumber?: number;
}

const CustomErrors = (props: Props): JSX.Element => {
  const { data, chapterNumber } = props;
  const [values, setValues] = useState<ErrorData>({ reason: "", value: null });

  useEffect(() => {
    if (data.nodes && !data.nodes.chapters.length) {
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
      {values.reason && (
        <Custom404 reason={values.reason} value={values.value} />
      )}
    </div>
  );
};

export default memo(CustomErrors);
