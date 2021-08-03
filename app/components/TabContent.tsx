import { Dispatch, SetStateAction, useState } from "react";
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
    searchResults,
    sections,
    chapters,
    rules,
    subrules,
    setSearchData,
    setSearchResults,
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
    <div>
      <Tabs
        defaultActiveKey="search"
        variant="pills"
        onSelect={handleTabSelect}
      >
        <Tab eventKey="search" title="Search Rule Set">
          <div>
            <SearchForm
              setSearchData={setSearchData}
              setSearchResults={setSearchResults}
              searchedTerm={searchResults.searchTerm}
              sections={sections}
              chapters={chapters}
              rules={rules}
              subrules={subrules}
            />
          </div>
        </Tab>
        <Tab eventKey="ruleset" title="Load Rule Set">
          <RulesetForm smallText="Change and submit a link to view a different ruleset." />
        </Tab>
      </Tabs>
    </div>
  );
};

export default TabContent;
