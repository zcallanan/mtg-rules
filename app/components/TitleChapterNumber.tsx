import {
  useEffect,
  useState,
  MutableRefObject,
  Dispatch,
  SetStateAction,
  memo,
} from "react";
import { useRouter, NextRouter } from "next/router";
import useTopRule from "../hooks/useTopRule";
import {
  Chapter,
  ChapterValues,
  Rule,
  SearchData,
  SearchResults,
  TocScrollData,
} from "../typing/types";

interface Props {
  chaptersInUse: Chapter[];
  chapterValues: ChapterValues;
  paused: number;
  rootRef: MutableRefObject<HTMLDivElement>;
  rulesRef: MutableRefObject<HTMLDivElement[]>;
  rulesInUse: Rule[];
  searchData: SearchData;
  searchResults: SearchResults;
  setChapterValues: Dispatch<SetStateAction<ChapterValues>>;
  setScrollToc: Dispatch<SetStateAction<number>>;
  tocDivs: HTMLDivElement[];
}

const TitleChapterNumber = (props: Props): JSX.Element => {
  const {
    chaptersInUse,
    chapterValues,
    paused,
    rootRef,
    rulesRef,
    rulesInUse,
    searchData,
    searchResults,
    setChapterValues,
    setScrollToc,
    tocDivs,
  } = props;
  const { anchorValue, chapterNumber, ignoreCallbackNumber, source } =
    chapterValues;

  // State
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");
  const [localChapterNumberData, setLocalChapterNumberData] =
    useState<TocScrollData>({ chaptersInUse: [], tocDivs: [] });

  // Save to local state
  useEffect(() => {
    if (
      localChapterNumberData.chaptersInUse.length !== chaptersInUse.length ||
      (tocDivs &&
        tocDivs.length &&
        localChapterNumberData.tocDivs.length !== tocDivs.length)
    ) {
      setLocalChapterNumberData({
        chaptersInUse,
        tocDivs,
      });
    }
  }, [
    chaptersInUse,
    localChapterNumberData.chaptersInUse,
    localChapterNumberData.tocDivs,
    tocDivs,
  ]);

  // Router
  const router: NextRouter = useRouter();
  const path = router.asPath.split("#");

  // If path has an anchor value but it is not in state, save it to anchorChapter
  let anchorChapter: string;
  if (!anchorValue && path[1]) {
    [anchorChapter] = path[1].match(/\d{3}/);
  }

  // Get chapter number from intersection of the top rule
  const latestRuleChapterNumber = useTopRule(
    rulesRef.current,
    rootRef,
    rulesInUse
  );

  // Add a hash to url if none provided
  useEffect(() => {
    if (path.length === 1) {
      router.push("#100", undefined, { shallow: true });
    }
  }, [router, path]);

  // Initialize chapterValue state
  useEffect(() => {
    if (anchorChapter) {
      const aV = Number(anchorChapter);

      setChapterValues((prevValue) => ({
        ...prevValue,
        chapterNumber: aV,
        anchorValue: aV,
        source: "init",
      }));
    }
  }, [path, anchorValue, setChapterValues, anchorChapter]);

  // On load or search, scroll ToC viewport to chapterNumber
  useEffect(() => {
    if (
      chapterNumber &&
      (source === "init" || source === "search") &&
      localChapterNumberData.tocDivs &&
      localChapterNumberData.tocDivs.length &&
      !localChapterNumberData.tocDivs.includes(null) &&
      localChapterNumberData.chaptersInUse &&
      localChapterNumberData.chaptersInUse.length
    ) {
      setScrollToc(chapterNumber);
    }
  }, [
    chapterNumber,
    localChapterNumberData.chaptersInUse,
    localChapterNumberData.tocDivs,
    setScrollToc,
    source,
    tocDivs,
  ]);

  // When searching, set chapterNumber to the first value in chaptersInUse
  useEffect(() => {
    if (
      latestRuleChapterNumber &&
      searchData.searchCompleted &&
      searchResults.searchResult &&
      searchResults.searchChapters.length
    ) {
      let firstChapterNumber: number;
      if (
        localChapterNumberData.chaptersInUse &&
        localChapterNumberData.chaptersInUse.length
      ) {
        firstChapterNumber =
          localChapterNumberData.chaptersInUse[0].chapterNumber;
      }
      setChapterValues((prevValue) => ({
        ...prevValue,
        source: "search",
        chapterNumber: firstChapterNumber,
      }));
    }
  }, [
    latestRuleChapterNumber,
    localChapterNumberData.chaptersInUse,
    searchData.searchCompleted,
    searchResults.searchChapters.length,
    searchResults.searchResult,
    setChapterValues,
  ]);

  // Set chapterNumber after search is cleared
  useEffect(() => {
    if (
      latestRuleChapterNumber &&
      searchData.searchCleared &&
      localSearchTerm !== searchData.previousSearchTerm
    ) {
      setLocalSearchTerm(searchData.previousSearchTerm);
      setChapterValues((prevValue) => ({
        ...prevValue,
        source: "search cleared",
        chapterNumber: 100,
      }));
    }
  }, [
    chaptersInUse,
    latestRuleChapterNumber,
    localSearchTerm,
    searchData.previousSearchTerm,
    searchData.searchCleared,
    setChapterValues,
  ]);

  // If there was a source other than a callback chapterNumber, then ignore current callback
  useEffect(() => {
    // useTopRule callback returns after this, so there must be a pause to wait for the callback value to ignore
    if (latestRuleChapterNumber && source !== "callback" && !paused) {
      setChapterValues((prevValue) => ({
        ...prevValue,
        source: "callback",
        ignoreCallbackNumber: latestRuleChapterNumber,
      }));
    }
  }, [latestRuleChapterNumber, paused, setChapterValues, source]);

  // When scrolling, save the chapterNumber from useTopRule callback
  useEffect(() => {
    if (
      latestRuleChapterNumber &&
      source === "callback" &&
      chapterNumber !== latestRuleChapterNumber &&
      ignoreCallbackNumber !== latestRuleChapterNumber
    ) {
      setChapterValues((prevValue) => ({
        ...prevValue,
        source: "callback",
        chapterNumber: latestRuleChapterNumber,
        ignoreCallbackNumber: 999,
      }));
    }
  }, [
    chapterNumber,
    latestRuleChapterNumber,
    ignoreCallbackNumber,
    setChapterValues,
    source,
  ]);

  return null;
};

export default memo(TitleChapterNumber);
