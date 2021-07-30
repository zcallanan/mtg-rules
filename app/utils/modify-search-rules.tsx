import { ReactNodeArray } from "react";
import reactStringReplace from "react-string-replace";
import { ModifyArgs } from "../typing/types";

const wrapSearchTerm = (args: ModifyArgs): string | ReactNodeArray => {
  const { searchTerm, rule, subrule, toModify } = args;

  return reactStringReplace(
    toModify,
    searchTerm,
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

const modifySearchRules = (args: ModifyArgs): string | ReactNodeArray => {
  // Deconstruct args
  const { searchTerm, rule, subrule, toModify } = args;

  // Modify
  return rule
    ? wrapSearchTerm({ searchTerm, rule, toModify })
    : wrapSearchTerm({ searchTerm, subrule, toModify });
};

export default modifySearchRules;
