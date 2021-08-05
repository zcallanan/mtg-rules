import { ReactNodeArray } from "react";
import reactStringReplace from "react-string-replace";
import { ExampleModifyArgs } from "../typing/types";

const wrapExampleText = (args: ExampleModifyArgs): string | ReactNodeArray => {
  const { exampleText, rule, subrule } = args;

  return reactStringReplace(
    exampleText,
    "Example:",
    (match: string, i: number, offset: number) => (
      <span
        key={
          rule
            ? `example.${rule.chapterNumber}-${rule.ruleNumber}-${i}${offset}`
            : `example.${subrule.chapterNumber}-${subrule.ruleNumber}-${subrule.ruleNumber}${subrule.subruleLetter}-${i}${offset}`
        }
        className={"exampleEmphasis"}
      >
        <em>{match}</em>
      </span>
    )
  );
};

const modifyExampleText = (
  args: ExampleModifyArgs
): string | ReactNodeArray => {
  // Deconstruct args
  const { exampleText, rule, subrule } = args;

  // Modify
  return rule
    ? wrapExampleText({ exampleText, rule })
    : wrapExampleText({ exampleText, subrule });
};

export default modifyExampleText;
