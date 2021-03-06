import { ReactNodeArray } from "react";
import parseAnchorLinks from "./parse-anchor-links";
import replaceExampleText from "./replace-example-text";
import replaceSearchTerm from "./replace-search-term";
import replaceUrlLinks from "./replace-url-links";
import { ReplaceTextArgs } from "../typing/types";

const replaceText = (args: ReplaceTextArgs): ReactNodeArray | string => {
  const {
    allChaptersN,
    example,
    onLinkClick,
    routerValues,
    rule,
    searchResults,
    subrule,
  } = args;

  let result: ReactNodeArray | string;

  if (rule && !example) {
    if (!searchResults.searchTerm) {
      // Rule with no search filter
      result = replaceUrlLinks({
        rule,
        toModify: parseAnchorLinks({
          routerValues,
          onLinkClick,
          rule,
          searchResults,
          allChaptersN,
        }),
      });
    } else {
      // Rule with a search filter
      result = replaceUrlLinks({
        rule,
        toModify: replaceSearchTerm({
          searchResults,
          rule,
          toModify: parseAnchorLinks({
            routerValues,
            onLinkClick,
            rule,
            searchResults,
            allChaptersN,
          }),
        }),
      });
    }
  } else if (subrule && !example) {
    if (!searchResults.searchTerm) {
      // Subrule with no search filter
      result = replaceUrlLinks({
        subrule,
        toModify: parseAnchorLinks({
          routerValues,
          onLinkClick,
          subrule,
          searchResults,
          allChaptersN,
        }),
      });
    } else {
      // Subrule with a search filter
      result = replaceUrlLinks({
        subrule,
        toModify: replaceSearchTerm({
          searchResults,
          subrule,
          toModify: parseAnchorLinks({
            routerValues,
            onLinkClick,
            subrule,
            searchResults,
            allChaptersN,
          }),
        }),
      });
    }
  } else if (example) {
    if (!searchResults.searchTerm) {
      // Emphasize example text with no search filter
      result = replaceExampleText(
        rule
          ? {
              rule,
              exampleText: replaceUrlLinks({
                rule,
                toModify: parseAnchorLinks({
                  routerValues,
                  onLinkClick,
                  example,
                  rule,
                  searchResults,
                  allChaptersN,
                }),
              }),
            }
          : {
              subrule,
              exampleText: replaceUrlLinks({
                subrule,
                toModify: parseAnchorLinks({
                  routerValues,
                  onLinkClick,
                  example,
                  subrule,
                  searchResults,
                  allChaptersN,
                }),
              }),
            }
      );
    } else {
      // Emphasize example text with a search filter
      result = replaceExampleText(
        rule
          ? {
              rule,
              exampleText: replaceSearchTerm({
                searchResults,
                rule,
                toModify: replaceUrlLinks({
                  rule,
                  toModify: parseAnchorLinks({
                    routerValues,
                    onLinkClick,
                    example,
                    rule,
                    searchResults,
                    allChaptersN,
                  }),
                }),
              }),
            }
          : {
              subrule,
              exampleText: replaceSearchTerm({
                searchResults,
                subrule,
                toModify: replaceUrlLinks({
                  subrule,
                  toModify: parseAnchorLinks({
                    routerValues,
                    onLinkClick,
                    example,
                    subrule,
                    searchResults,
                    allChaptersN,
                  }),
                }),
              }),
            }
      );
    }
  }
  // Return original string or ReactNodeArray to render
  return result;
};

export default replaceText;
