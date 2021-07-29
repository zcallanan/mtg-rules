import { ReactNodeArray } from "react";
import reactStringReplace from "react-string-replace";
import { ModifyArgs } from "../typing/types";

const wrapSearchTerm = (args: ModifyArgs): string | ReactNodeArray => {
  const { searchTerm, rule, subrule, toModify } = args;
  return reactStringReplace(
    toModify,
    searchTerm,
    (match: string, i: number) => (
      <span
        key={
          rule
            ? `.${rule.ruleNumber}-${i}`
            : `.${subrule.ruleNumber}${subrule.subruleLetter}-${i}`
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
