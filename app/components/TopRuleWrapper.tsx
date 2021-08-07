import { useEffect, MutableRefObject, Dispatch, SetStateAction } from "react";
import { useRouter, NextRouter } from "next/router";
import useTopRule from "../hooks/useTopRule";
import {
  Chapter,
  ChapterValues,
  Rule,
  SearchData,
  SearchResults,
} from "../typing/types";

interface Props {
  chaptersInUse: Chapter[];
  chapterValues: ChapterValues;
  rootRef: MutableRefObject<HTMLDivElement>;
  rulesRef: MutableRefObject<HTMLDivElement[]>;
  rulesInUse: Rule[];
  searchData: SearchData;
  searchResults: SearchResults;
  setChapterValues: Dispatch<SetStateAction<ChapterValues>>;
  setScrollToc: Dispatch<SetStateAction<number>>;
  tocRefDivs: HTMLDivElement[];
}

const TopRuleWrapper = (props: Props): JSX.Element => {
  const {
    chaptersInUse,
    chapterValues,
    rootRef,
    rulesRef,
    rulesInUse,
    searchData,
    searchResults,
    setChapterValues,
    setScrollToc,
    tocRefDivs,
  } = props;
  const { anchorValue, chapterNumber, ignoreCallbackNumber, source } =
    chapterValues;

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
      tocRefDivs.length &&
      (source === "init" || source === "search")
    ) {
      setScrollToc(chapterNumber);
    }
  }, [chapterNumber, setScrollToc, source, tocRefDivs.length]);

  // When searching, set chapterNumber to the first value in chaptersInUse
  useEffect(() => {
    if (
      latestRuleChapterNumber &&
      searchData.searchCompleted &&
      searchResults.searchResult &&
      searchResults.searchChapters.length
    ) {
      const firstChapterNumber = chaptersInUse[0].chapterNumber;
      setChapterValues((prevValue) => ({
        ...prevValue,
        source: "search",
        chapterNumber: firstChapterNumber,
        ignoreCallbackNumber: latestRuleChapterNumber,
      }));
    }
  }, [
    chaptersInUse,
    latestRuleChapterNumber,
    searchData.searchCompleted,
    searchResults.searchChapters.length,
    searchResults.searchResult,
    setChapterValues,
  ]);

  // When loading, or a chapter title is clicked, ignore the number from useTopRule
  useEffect(() => {
    if (
      latestRuleChapterNumber &&
      (source === "init" ||
        source === "prop increase" ||
        source === "prop decrease")
    ) {
      setChapterValues((prevValue) => ({
        ...prevValue,
        source: "callback",
        ignoreCallbackNumber: latestRuleChapterNumber,
      }));
    }
  }, [latestRuleChapterNumber, setChapterValues, source]);

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

export default TopRuleWrapper;
