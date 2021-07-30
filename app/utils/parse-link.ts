import { ReactNodeArray } from "react";
import replaceRuleNumbers from "./replace-rule-numbers";
import nodeNumbers from "./node-numbers";
import { ParseLinkArgs, ReplaceRuleNumbers } from "../typing/types";

const parseLink = (args: ParseLinkArgs): string | ReactNodeArray => {
  const { routerValues, onLinkClick, example, rule, subrule, searchResults } =
    args;
  const {
    searchTerm,
    searchSections,
    searchChapters,
    searchRules,
    searchSubrules,
  } = searchResults;

  let linkText: string;
  if (example) {
    linkText = example;
  } else if (rule) {
    linkText = rule.text;
  } else if (subrule) {
    linkText = subrule.text;
  }

  const searchValues: string[] = [];

  if (searchTerm) {
    searchValues.push(...nodeNumbers(searchSections));
    searchValues.push(...nodeNumbers(searchChapters));
    searchValues.push(...nodeNumbers(searchRules));
    searchValues.push(...nodeNumbers(searchSubrules));
  }

  // Regex
  const regexSection = /section\s+(\d)/gim;
  // Include extra characters to avoid creating links on erroneous numbers, ex: 2011
  const regexChapter = /\s+(\d{3})[\s,.;()]/gim;
  const regexRule = /(\d{3})\.(\d+)/gim;
  const regexSubrule = /(\d{3})\.(\d+)([a-z]+)/gim;
  const regexes = [regexSubrule, regexRule, regexChapter, regexSection];

  const findMatches = (
    regexArray: RegExp[],
    text: string
  ): string | ReactNodeArray => {
    const matchArray: RegExpMatchArray[] = [];
    const indexOfArray: number[][] = [];

    // Push all matched ruleNumber strings to matchArray
    regexArray.forEach((regex, i) => {
      // Find all matches for a particular regex
      matchArray.push(text.match(regex));

      // Remove extra characters
      matchArray[matchArray.length - 1].forEach((match, ind) => {
        if (match.includes("section")) {
          matchArray[matchArray.length - 1][ind] = match.replace(
            /section\s+/,
            ""
          );
        }
        if (/\s|\.|,|;|-|:|\)/g.test(match) && regexChapter.test(match)) {
          // eslint-disable-next-line prefer-destructuring
          matchArray[matchArray.length - 1][ind] = match.match(/\d{3}/)[0];
        }
      });

      // Find starting position for all values of most recent push
      indexOfArray[i] = matchArray[matchArray.length - 1].map((match) =>
        linkText.indexOf(match)
      );
    });

    const flatIndexOf: number[] = indexOfArray.flat();
    const extraRuleNumbers: string[] = matchArray.flat();
    const trackIndex: number[] = [];
    const ruleNumberArray: string[] = [];

    extraRuleNumbers.forEach((s, i) => {
      if (!trackIndex.includes(flatIndexOf[i])) {
        trackIndex.push(flatIndexOf[i]);
        ruleNumberArray.push(s);
      }
    });

    //   TODO: Prevent invalid chapter values like 999

    // If there are searchResults, remove all values not found in searchValues, or get links to nowhere
    const linkValues: string[] = searchTerm
      ? ruleNumberArray.filter((s) => searchValues.includes(s))
      : ruleNumberArray;

    const argObject: ReplaceRuleNumbers = rule
      ? {
          text,
          ruleNumberArray: linkValues,
          routerValues,
          onLinkClick,
          rule,
        }
      : {
          text,
          ruleNumberArray: linkValues,
          routerValues,
          onLinkClick,
          subrule,
        };

    // If there are values to replace, pass to replaceRuleNumbers
    const replaceResult: string | ReactNodeArray = linkValues.length
      ? replaceRuleNumbers(argObject)
      : text;

    // Return ReactNodeArray with links or original text
    return replaceResult;
  };

  // Test if subrule, rule, chapter, and section numbers appear in text
  const regexArray: RegExp[] = [];
  regexes.forEach((regex) => {
    if (regex.test(linkText)) {
      regexArray.push(regex);
    }
  });

  // If there are no linkable ruleNumbers, use linkText, else process matches
  const result: string | ReactNodeArray = !regexArray.length
    ? linkText
    : findMatches(regexArray, linkText);

  // Return original string or string with links
  return result;
};

export default parseLink;
