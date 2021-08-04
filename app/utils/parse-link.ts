import { ReactNodeArray } from "react";
import replaceRuleNumbers from "./replace-rule-numbers";
import nodeNumbers from "./node-numbers";
import { ParseLinkArgs, ReplaceRuleNumbers } from "../typing/types";

const parseLink = (args: ParseLinkArgs): string | ReactNodeArray => {
  const {
    routerValues,
    onLinkClick,
    example,
    rule,
    subrule,
    searchResults,
    allChaptersN,
  } = args;
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
  const regexSection = /(section)\s+(\d{1})/gim;
  const regexChapter = /(\d{3})(?=,|\)|\w)/gim;
  const regexRule = /(\d{3}\.\d{1,3})(?=,|\)|\s|\.|-|—)/gim;
  const regexSubrule = /(\d{3}\.\d{1,3}[a-z-])/gim;
  const regexes = [regexSubrule, regexRule, regexChapter, regexSection];

  const findMatches = (
    regexArray: RegExp[],
    text: string
  ): string | ReactNodeArray => {
    const filteredArray: RegExpMatchArray[] = [];

    // Push all matched ruleNumber strings to filteredArray
    regexArray.forEach((regex, i) => {
      if (regex === regexSection) {
        const matchArray: RegExpMatchArray = text.match(regex);
        matchArray[0] = matchArray[0].replace(/section\s+/, "");
        filteredArray[i] = matchArray;
      } else if (regex === regexChapter) {
        const matchArray: RegExpMatchArray = text.match(regex);
        filteredArray[i] = matchArray.filter((a) => {
          return allChaptersN.includes(a);
        });
      } else {
        filteredArray[i] = text.match(regex);
      }
    });

    const ruleNumberArray: string[] = filteredArray.flat();

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
