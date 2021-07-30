import { ReactNodeArray } from "react";
import Link from "next/link";
import reactStringReplace from "react-string-replace";
import { ReplaceRuleNumbers } from "../typing/types";

const replaceRuleNumbers = (args: ReplaceRuleNumbers): ReactNodeArray => {
  // In list of rules and subrules, wraps section, chapter, rule, and subrule #'s with a link component
  const { text, ruleNumberArray, routerValues, onLinkClick, rule, subrule } =
    args;

  let updatedText: ReactNodeArray;
  ruleNumberArray.forEach((ruleNumber, index) => {
    // Single digit is a section, so multiply by 100, else match chapterNumber
    const chapterValue: number | string = /(?<!\S)\d(?!\S)/.test(ruleNumber)
      ? Number(ruleNumber) * 100
      : ruleNumber;

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
            as={`/rules/${routerValues.year}/${routerValues.version}#${chapterValue}`}
            scroll={false}
          >
            <a>
              <span
                onClick={() =>
                  onLinkClick(
                    typeof chapterValue === "string"
                      ? Number(chapterValue.match(/\d{3}/)[0])
                      : chapterValue,
                    "rules"
                  )
                }
              >
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
