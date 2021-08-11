import { Dispatch, SetStateAction, useEffect, memo } from "react";
import { ChapterValues, ClickData } from "../typing/types";

interface Props {
  chapterValues: ChapterValues;
  clickData: ClickData;
  paused: number;
  setChapterValues: Dispatch<SetStateAction<ChapterValues>>;
  setClickedData: Dispatch<SetStateAction<ClickData>>;
  setPaused: Dispatch<SetStateAction<number>>;
  setScrollToc: Dispatch<SetStateAction<number>>;
}

const ChapterClicked = (props: Props): JSX.Element => {
  const {
    chapterValues,
    clickData,
    paused,
    setChapterValues,
    setClickedData,
    setPaused,
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
    if (
      chapterValues.chapterNumber !== chapterN &&
      (source === "prop increase" || source === "prop decrease")
    ) {
      // Toggle pause, else get a bad callback value after this is set
      if (!paused) {
        setPaused(1);
        setTimeout(() => {
          setPaused(0);
        }, 200);
      }
      setChapterValues((prevValue) => ({
        ...prevValue,
        chapterNumber: chapterN,
        anchorValue: chapterN,
        source,
      }));
    }
  }, [
    chapterN,
    chapterValues.chapterNumber,
    paused,
    setChapterValues,
    setPaused,
    source,
  ]);

  // Reset clickedData
  useEffect(() => {
    if (clickData.chapterN) {
      setClickedData({
        chapterN: 0,
        dataSource: "",
      });
    }
  }, [clickData.chapterN, setClickedData]);

  // Don't render
  return null;
};

export default memo(ChapterClicked);
