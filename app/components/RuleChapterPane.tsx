import ChapterTitle from "./ChapterTitle";
import NoSearchResults from "./NoSearchResults";
import {
  ChapterValues,
  SearchData,
  SearchResults,
  Chapter,
  Section,
} from "../typing/types";
import styles from "../styles/RuleChapterPane.module.scss";

interface Props {
  searchData: SearchData;
  searchResults: SearchResults;
  chapters: Chapter[];
  chapterValues: ChapterValues;
  sections: Section[];
}

const RuleChapterPane = (props: Props): JSX.Element => {
  const { searchData, searchResults, chapters, chapterValues, sections } =
    props;

  return (
    <div className={styles.ruleChapterPane}>
      {searchData.searchTerm &&
      !searchResults.searchResult &&
      searchData.searchCompleted ? (
        <NoSearchResults title={1} />
      ) : (
        <ChapterTitle
          chapter={chapters.find(
            (chapter) => chapter.chapterNumber === chapterValues.chapterNumber
          )}
          toc={0}
          sections={sections}
        />
      )}
    </div>
  );
};

export default RuleChapterPane;
