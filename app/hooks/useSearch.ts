import uniqBy from "lodash/uniqBy";
import { SearchData, SearchResults } from "../typing/types";

const useSearch = ((props: SearchData): SearchResults =>{
  const { searchTerm, sections, chapters, rules, subrules } = props;

    /* 
    - Filter rules and subrules node arrays
    - Subrules & example text are not displayed without context of what rule it belongs to,
        whether rule has the searchTerm or not
    - If a subrule &/or exampleText has a match, and its rule text does not, then that rule should be included
        in searchResults rules array
    */

    // Create regex
    const termRegex = new RegExp(searchTerm, "gim");

    // Checks whether a rule or subrule's exampleArray contains searchTerm
    const checkExamples = (exampleArray: string[]): number => {
    const result = exampleArray.filter((exampleText) => termRegex.test(exampleText))
    return (result.length) ? 1 : 0;
    };

    // Get rule nodes subset where rule, child subrules, or child example text returns true for termRegex
    const testRules = (): SearchResults => {
      const subrulesResult = subrules.filter((subruleNode) => termRegex.test(subruleNode.text) || ((subruleNode.example.length) 
        ? checkExamples(subruleNode.example)
        : 0
      ))
      const subruleRules: number[][] = subrulesResult.map((subrule) => ([subrule.chapterNumber, subrule.ruleNumber]));

      /*
        1. Rule has searchTerm OR
        2. Rule's example text has searchTerm (checkExamples) OR
        3. Rule's subrule or subrule example text has searchTerm (subrulesRules)
      */
      const rulesResult = rules.filter((node) => termRegex.test(node.text) 
        || ((node.example.length) 
          ? checkExamples(node.example)
          : 0
        ) || (subruleRules.some((val) => val[0] === node.chapterNumber && val[1] === node.ruleNumber)
      ));

      // Sections & chapters found in rulesResult
      const ruleValues = rulesResult.map((rule) => ([rule.sectionNumber, rule.chapterNumber]));

      // Make sections and chapters unique, else toc has duplicates
      const ruleSections = uniqBy(ruleValues
        .map((val) => sections
        .find((section) => section.sectionNumber === val[0])), "sectionNumber");
      const ruleChapters = uniqBy(ruleValues
        .map((val) => chapters
        .find((chapter) => chapter.chapterNumber === val[1])), "chapterNumber");

      // Return SearchResults
      return {
        searchTerm,
        searchSections: ruleSections,
        searchChapters: ruleChapters,
        searchRules: rulesResult,
        searchResult: (rulesResult.length) ? 1 : 0
      };
    };

  // Return
  return testRules();
});

export default useSearch;