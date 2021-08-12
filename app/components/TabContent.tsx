import { Dispatch, SetStateAction, useState, memo } from "react";
import { Tabs, Tab } from "react-bootstrap";
import RulesetForm from "./RulesetForm";
import SearchForm from "./SearchForm";
import {
  SearchData,
  SearchResults,
  Section,
  Chapter,
  Rule,
  Subrule,
} from "../typing/types";
import styles from "../styles/TabContent.module.scss";

interface Props {
  searchResults: SearchResults;
  sections: Section[];
  chapters: Chapter[];
  rules: Rule[];
  subrules: Subrule[];
  setSearchData: Dispatch<SetStateAction<SearchData>>;
  setSearchResults: Dispatch<SetStateAction<SearchResults>>;
}

const TabContent = (props: Props): JSX.Element => {
  const {
    chapters,
    rules,
    searchResults,
    sections,
    setSearchData,
    setSearchResults,
    subrules,
  } = props;

  // State
  const [searchActive, setSearchActive] = useState<boolean>(true);

  // Disable the active tab
  const handleTabSelect = (eventKey: string): void => {
    if (eventKey === "search" && !searchActive) {
      setSearchActive(true);
    } else if (eventKey === "ruleset" && searchActive) {
      setSearchActive(false);
    }
  };

  return (
    <div className={styles.tabsContainer}>
      <Tabs
        defaultActiveKey="search"
        onSelect={handleTabSelect}
        variant="pills"
      >
        <Tab eventKey="search" title="Search Rule Set">
          <div>
            <SearchForm
              chapters={chapters}
              rules={rules}
              searchResults={searchResults}
              sections={sections}
              setSearchData={setSearchData}
              setSearchResults={setSearchResults}
              subrules={subrules}
            />
          </div>
        </Tab>
        <Tab eventKey="ruleset" title="Load Rule Set">
          <RulesetForm />
        </Tab>
      </Tabs>
    </div>
  );
};

export default memo(TabContent);
