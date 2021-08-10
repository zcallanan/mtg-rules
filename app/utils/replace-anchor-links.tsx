import { ReactNodeArray } from "react";
import Link from "next/link";
import reactStringReplace from "react-string-replace";
import { ReplaceAnchorLinks } from "../typing/types";

const replaceAnchorLinks = (args: ReplaceAnchorLinks): ReactNodeArray => {
  // In list of rules and subrules, wraps section, chapter, rule, and subrule #'s with a link component
  const { text, ruleNumberArray, routerValues, onLinkClick, rule, subrule } =
    args;

  let updatedText: ReactNodeArray;
  ruleNumberArray.forEach((ruleNumber, index) => {
    // Single digit is a section, so multiply by 100, else match chapterNumber
    const chapterValue: number | string = /^\d(?!\S)/.test(ruleNumber)
      ? Number(ruleNumber) * 100
      : ruleNumber;

    // Replace a string with a ReactNodeArray
    updatedText = reactStringReplace(
      !index ? text : updatedText,
      ruleNumber,
      (match: string, i: number, offset: number) => (
        <span
          key={
            rule
              ? `${rule.ruleNumber}-${ruleNumber}-${i}${offset}`
              : `${subrule.ruleNumber}${subrule.subruleLetter}-${ruleNumber}-${i}${offset}`
          }
        >
          <Link
            href={"/rules/[routerValues.year]/[routerValues.version]"}
            as={`/rules/${routerValues.year}/${routerValues.version}#${chapterValue}`}
            scroll={false}
          >
            <a>
              <span
                className={rule ? "ruleLink" : "subruleLink"}
                onClick={() =>
                  onLinkClick(
                    typeof chapterValue === "string"
                      ? Number(chapterValue.match(/\d{3}/)[0])
                      : chapterValue,
                    "rules"
                  )
                }
              >
                <strong>{match}</strong>
              </span>
            </a>
          </Link>
        </span>
      )
    );
  });
  return updatedText;
};

export default replaceAnchorLinks;
