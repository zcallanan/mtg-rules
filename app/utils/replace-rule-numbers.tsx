import { ReactNodeArray } from "react";
import Link from "next/link";
import reactStringReplace from "react-string-replace";
import { ReplaceRuleNumbers } from "../typing/types";

const replaceRuleNumbers = (args: ReplaceRuleNumbers): ReactNodeArray => {
  // In list of rules and subrules, wraps section, chapter, rule, and subrule #'s with a link component
  const { text, ruleNumberArray, routerValues, onLinkClick, rule, subrule } =
    args;
  let updatedText: ReactNodeArray;
  let chapterValue: number;
  ruleNumberArray.forEach((ruleNumber, index) => {
    // If it is a single digit, assign a chapter value
    if (/(?<!\S)\d(?!\S)/.test(ruleNumber)) {
      chapterValue = Number(ruleNumber) * 100;
    }

    // Replace a string with a ReactNodeArray
    updatedText = reactStringReplace(
      !index ? text : updatedText,
      ruleNumber,
      (match: string, i: number) => (
        <span
          key={
            rule
              ? `${rule.ruleNumber}-${ruleNumber}-${i}`
              : `${subrule.ruleNumber}${subrule.subruleLetter}-${ruleNumber}-${i}`
          }
        >
          <Link
            href={"/rules/[routerValues.year]/[routerValues.version]"}
            as={`/rules/${routerValues.year}/${routerValues.version}#${
              chapterValue || ruleNumber
            }`}
            scroll={false}
          >
            <a>
              <span onClick={() => onLinkClick(chapterValue, "rules")}>
                {match}
              </span>
            </a>
          </Link>
        </span>
      )
    );
  });
  return updatedText;
};

export default replaceRuleNumbers;
