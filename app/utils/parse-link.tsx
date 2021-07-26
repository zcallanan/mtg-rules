import { ReactNodeArray } from "react";
import Link from "next/link";
import reactStringReplace from "react-string-replace";
import { ParseLinkArgs, ReplaceRuleNumbers } from "../typing/types";

const replaceRuleNumbers = (args: ReplaceRuleNumbers): ReactNodeArray => {
  const {
    text,
    ruleNumberArray,
    routerValues,
    onLinkClick,
    rule,
    subrule,
  } = args;
  let updatedText: ReactNodeArray;
  ruleNumberArray.forEach((ruleNumber, index) => {
    const chapterValue = (/\d{3}/.test(ruleNumber))
      ? Number(ruleNumber.match(/\d{3}/)[0])
      : Number(ruleNumber) * 100;

    updatedText = reactStringReplace(
      ((!index) ? text : updatedText),
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
              <span onClick={() => onLinkClick(chapterValue, "rules")}>
                {match}
              </span>
            </a>
          </Link>
        </span>
      ),
    );
  });
  return updatedText;
};

const parseLink = (args: ParseLinkArgs): string | ReactNodeArray => {
  const {
    routerValues,
    onLinkClick,
    example,
    rule,
    subrule,
  } = args;
  let linkText: string;
  if (example) {
    linkText = example;
  } else if (rule) {
    linkText = rule.text;
  } else if (subrule) {
    linkText = subrule.text;
  }

  // Regex
  const regexSection = /section\s+(\d)/gim;
  // Include extra characters to avoid creating links on erroneous numbers, ex: 2011
  const regexChapter = /\s+(\d{3})[\s,.;]/gim;
  const regexRule = /(\d{3})\.(\d+)/gim;
  const regexSubrule = /(\d{3})\.(\d+)([a-z]+)/gim;
  const regexes = [regexSubrule, regexRule, regexChapter, regexSection];

  const findMatches = (
    regexArray: RegExp[],
    text: string,
  ): string | ReactNodeArray => {
    const matchArray: RegExpMatchArray[] = [];

    // Push all matched ruleNumber strings to matchArray
    regexArray.forEach((regex) => {
      // Find all matches for a particular regex
      matchArray.push(text.match(regex));
    });

    // Flatten matchArray
    const ruleNumberArray: string[] = matchArray.flat();

    // Remove extra characters from matchArray
    ruleNumberArray.forEach((ruleNumber, i) => {
      // Remove /section\s+/ from matchArray
      if (ruleNumber.includes("section")) {
        ruleNumberArray[i] = ruleNumber.replace(/section\s+/, "");
      }

      // TODO: Prevent invalid chapter values like 999
      // Remove extra characters from chapter ruleNumbers
      if (/\s|\.|,|;|-|:/.test(ruleNumber) && (regexChapter).test(ruleNumber)) {
        ruleNumberArray[i] = ruleNumber.replace(/\s|\.|,|;|-|:/g, "");
      }
    });

    const argObject: ReplaceRuleNumbers = (rule)
      ? {
        text,
        ruleNumberArray,
        routerValues,
        onLinkClick,
        rule,
      }
      : {
        text,
        ruleNumberArray,
        routerValues,
        onLinkClick,
        subrule,
      };
    return replaceRuleNumbers(argObject);
  };

  // Test if subrule, rule, chapter, and section numbers appear in text
  const regexArray: RegExp[] = [];
  regexes.forEach((regex) => {
    if (regex.test(linkText)) {
      regexArray.push(regex);
    }
  });

  // If there are no linkable ruleNumbers, use linkText, else process matches
  const result: string | ReactNodeArray = (!regexArray.length)
    ? linkText
    : findMatches(regexArray, linkText);

  // Return original string or string with links
  return result;
};

export default parseLink;
