import { ReactNodeArray } from "react";
import reactStringReplace from "react-string-replace";
import { ReplaceSearchTermArgs } from "../typing/types";

const wrapSearchTerm = (
  args: ReplaceSearchTermArgs
): string | ReactNodeArray => {
  const { searchResults, rule, subrule, toModify } = args;
  const { searchTerm, searchType } = searchResults;

  // Exact search is case sensitive.
  const casing = searchType === "exact" ? "g" : "gi";
  const re = new RegExp(`(${searchTerm})`, casing);

  return reactStringReplace(
    toModify,
    re,
    (match: string, i: number, offset: number) => (
      <span
        key={
          rule
            ? `${searchTerm}.${rule.chapterNumber}-${rule.ruleNumber}-${i}${offset}`
            : `${searchTerm}.${subrule.chapterNumber}-${subrule.ruleNumber}-${subrule.ruleNumber}${subrule.subruleLetter}-${i}${offset}`
        }
        className={"searchText"}
        style={{
          backgroundColor: "yellow",
        }}
      >
        {match}
      </span>
    )
  );
};

const replaceSearchTerm = (
  args: ReplaceSearchTermArgs
): string | ReactNodeArray => {
  // Deconstruct args
  const { searchResults, rule, subrule, toModify } = args;

  // Modify
  return rule
    ? wrapSearchTerm({ searchResults, rule, toModify })
    : wrapSearchTerm({ searchResults, subrule, toModify });
};

export default replaceSearchTerm;
