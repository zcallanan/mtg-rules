import { Dispatch, SetStateAction, useEffect } from "react";
import { ChapterValues, ClickData } from "../typing/types";

interface Props {
  chapterValues: ChapterValues;
  clickData: ClickData;
  setChapterValues: Dispatch<SetStateAction<ChapterValues>>;
  setClickedData: Dispatch<SetStateAction<ClickData>>;
  setScrollToc: Dispatch<SetStateAction<number>>;
}

const ChapterClicked = (props: Props): JSX.Element => {
  const {
    chapterValues,
    clickData,
    setChapterValues,
    setClickedData,
    setScrollToc,
  } = props;
  const { chapterN, dataSource } = clickData;

  // If chapterNumber comes from a sectionList viewport link, scroll Toc
  useEffect(() => {
    if (dataSource === "rules" && chapterN) {
      setScrollToc(chapterN);
    }
  }, [chapterN, dataSource, setScrollToc]);

  let source: string;

  // Determine if chapterNumber has increased or decreased. Intersection Observer behaves differently for each
  const { chapterNumber } = chapterValues;
  if (chapterNumber && chapterN < chapterNumber) {
    source = "prop decrease";
  } else if (chapterNumber && chapterN > chapterNumber) {
    source = "prop increase";
  }

  // Update ChapterValues
  useEffect(() => {
    if (chapterValues.chapterNumber !== chapterN) {
      setChapterValues((prevValue) => ({
        ...prevValue,
        chapterNumber: chapterN,
        anchorValue: chapterN,
        source,
      }));
    }
  }, [chapterN, chapterValues.chapterNumber, setChapterValues, source]);

  // Reset clickedData
  useEffect(() => {
    if (clickData.chapterN) {
      setClickedData({
        chapterN: 0,
        dataSource: "",
      });
    }
  }, [clickData.chapterN, setClickedData]);

  return null;
};

export default ChapterClicked;
