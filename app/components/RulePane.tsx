import { MutableRefObject } from "react";
import styles from "../styles/RulePane.module.scss";
import {
  SearchData,
  SearchResults,
  Section,
  Chapter,
  Rule,
  Subrule,
} from "../typing/types";
import NoSearchResults from "./NoSearchResults";
import SectionList from "./SectionList";

interface Props {
  searchData: SearchData;
  searchResults: SearchResults;
  sections: Section[];
  chapters: Chapter[];
  rules: Rule[];
  subrules: Subrule[];
  rulesRef: MutableRefObject<HTMLDivElement[]>;
  rightViewportRef: MutableRefObject<HTMLDivElement>;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
}

const RulePane = (props: Props): JSX.Element => {
  const {
    searchData,
    searchResults,
    sections,
    chapters,
    rules,
    subrules,
    rulesRef,
    rightViewportRef,
    onLinkClick,
  } = props;

  return (
    <div className={styles.rulePane}>
      {searchData.searchTerm &&
      !searchResults.searchResult &&
      searchData.searchCompleted ? (
        <NoSearchResults title={0} />
      ) : (
        <SectionList
          sections={sections}
          chapters={chapters}
          rules={
            searchResults.searchRules.length ? searchResults.searchRules : rules
          }
          subrules={
            searchResults.searchRules.length
              ? searchResults.searchSubrules
              : subrules
          }
          elRef={rulesRef}
          root={rightViewportRef}
          onLinkClick={onLinkClick}
          searchResults={searchResults}
        />
      )}
    </div>
  );
};

export default RulePane;
