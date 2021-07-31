import uniqBy from "lodash/uniqBy";
import {
  SearchData,
  SearchResults,
  Section,
  Chapter,
  Rule,
  Subrule,
} from "../typing/types";

const useSearch = (props: SearchData): SearchResults => {
  const { searchTerm, searchType, sections, chapters, rules, subrules } = props;

  /* 
    - Filter rules and subrules node arrays
    - Subrules & example text are not displayed without context of what rule it belongs to,
        whether rule has the searchTerm or not
    - If a subrule &/or exampleText has a match, and its rule text does not, then that rule should be included
        in searchResults rules array
  */

  // Create regex
  const termRegex: RegExp =
    searchType === "partial"
      ? new RegExp(searchTerm, "gim")
      : new RegExp(`\\W${searchTerm}\\W`, "gm");

  // Checks whether a rule or subrule's exampleArray contains searchTerm
  const checkExamples = (exampleArray: string[]): number => {
    const result = exampleArray.filter((exampleText) =>
      termRegex.test(exampleText)
    );
    return result.length ? 1 : 0;
  };

  // Get rule nodes subset where rule, child subrules, or child example text returns true for termRegex
  const testRules = (): SearchResults => {
    const subrulesResult: Subrule[] = subrules.filter(
      (subruleNode) =>
        termRegex.test(subruleNode.text) ||
        (subruleNode.example.length ? checkExamples(subruleNode.example) : 0)
    );
    const subruleRules: number[][] = subrulesResult.map((subrule) => [
      subrule.chapterNumber,
      subrule.ruleNumber,
    ]);

    /*
      1. Rule has searchTerm OR
      2. Rule's example text has searchTerm (checkExamples) OR
      3. Rule's subrule or subrule example text has searchTerm (subrulesRules)
    */
    const rulesResult: Rule[] = rules.filter(
      (node) =>
        termRegex.test(node.text) ||
        (node.example.length ? checkExamples(node.example) : 0) ||
        subruleRules.some(
          (val) => val[0] === node.chapterNumber && val[1] === node.ruleNumber
        )
    );

    const updateNodeExampleSearch = (nodes: Rule[] | Subrule[]): void => {
      nodes.forEach((node) => {
        // Find examples that have termRegex
        const matchingExamples: string[] = node.example.filter((exampleText) =>
          termRegex.test(exampleText)
        );
        // Clear exampleSearch, spread in matchingExamples
        node.exampleSearch.splice(
          0,
          node.exampleSearch.length,
          ...matchingExamples
        );
      });
    };

    // Update rules and subrules exampleSearch array
    updateNodeExampleSearch(rulesResult);
    updateNodeExampleSearch(subrulesResult);

    // Sections & chapters found in rulesResult
    const ruleValues: number[][] = rulesResult.map((rule) => [
      rule.sectionNumber,
      rule.chapterNumber,
    ]);

    // Make sections and chapters unique, else toc has duplicates
    const ruleSections: Section[] = uniqBy(
      ruleValues.map((val) =>
        sections.find((section) => section.sectionNumber === val[0])
      ),
      "sectionNumber"
    );
    const ruleChapters: Chapter[] = uniqBy(
      ruleValues.map((val) =>
        chapters.find((chapter) => chapter.chapterNumber === val[1])
      ),
      "chapterNumber"
    );

    // Return SearchResults
    return {
      searchTerm,
      searchSections: ruleSections,
      searchChapters: ruleChapters,
      searchRules: rulesResult,
      searchSubrules: subrulesResult,
      searchResult: rulesResult.length ? 1 : 0,
    };
  };

  // Return
  return testRules();
};

export default useSearch;
