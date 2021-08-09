import { ReactNodeArray } from "react";
import Link from "next/link";
import reactStringReplace from "react-string-replace";
import { ReplaceUrlLinksArgs } from "../typing/types";

const wrapUrlLinks = (args: ReplaceUrlLinksArgs): ReactNodeArray | string => {
  // Deconstruct args
  const { rule, subrule, toModify } = args;

  // Regex
  const re = /([\w]+\.[\w]+\.[\w/-]+|[\w]+\.[\w/-]+)/;

  return reactStringReplace(
    toModify,
    re,
    (match: string, i: number, offset: number) => {
      return match.length < 8 ? (
        // Return match if it's too short to be a url
        match
      ) : (
        <Link
          href={`https://${match}`}
          passHref
          key={
            rule
              ? `${rule.chapterNumber}-${rule.ruleNumber}-${i}${offset}`
              : `${subrule.chapterNumber}-${subrule.ruleNumber}-${subrule.ruleNumber}${subrule.subruleLetter}-${i}${offset}`
          }
        >
          <a target="_blank" rel="noopener noreferrer">
            <span className={rule ? "urlRuleLink" : "urlSubruleLink"}>
              <em>{match}</em>
            </span>
          </a>
        </Link>
      );
    }
  );
};
const replaceUrlLinks = (
  args: ReplaceUrlLinksArgs
): ReactNodeArray | string => {
  // Deconstruct args
  const { rule, subrule, toModify } = args;

  // Modify
  return rule
    ? wrapUrlLinks({ rule, toModify })
    : wrapUrlLinks({ subrule, toModify });
};

export default replaceUrlLinks;
