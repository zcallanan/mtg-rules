import Link from "next/link";
import reactStringReplace from "react-string-replace";
import { Rule, Subrule, RouterValues } from "./types";

const element = (
  updatedText: string,
  ruleNumber: string,
  routerValues: RouterValues,
  obj: Rule | Subrule,
): string => reactStringReplace(updatedText, ruleNumber, (match, i) => (
    <span
      key={
        obj.type === "rule"
          ? `${obj.ruleNumber}-${ruleNumber}-${i}`
          : `${obj.ruleNumber}${obj.subruleLetter}-${ruleNumber}-${i}`
      }
    >
      <Link
        href={"/rules/[routerValues.year]/[routerValues.version]"}
        as={`/rules/${routerValues.year}/${routerValues.version}#${ruleNumber}`}
        scroll={false}
      >
        <a>
          <span>{match}</span>
        </a>
      </Link>
    </span>
));

const parseLink = (
  obj: Rule | Subrule,
  routerValues: RouterValues,
  exampleText = "",
): string | JSX.element => {
  let linkText: string = exampleText || obj.text;

  const findMatches = (
    regex: RegExp,
    text: string | JSX.Element,
  ): string | JSX.Element => {
    let updatedText = text;

    // Get string matches
    const matchArray: string[] = (exampleText)
      ? exampleText.match(regex)
      : obj.text.match(regex);

    // Remove /section\s+/ from matchArray
    matchArray.forEach((value, i) => {
      if (value.includes("section")) {
        matchArray[i] = value.replace(/section\s+/, "");
      }
    });

    // Cycle through text for each rule number string, replacing number with jsx
    matchArray.forEach((ruleNumber) => {
      updatedText = element(updatedText, ruleNumber, routerValues, obj);
    });
    return updatedText;
  };

  // Regex
  const regexSection = /section\s+(\d)/gim;
  const regexChapter = /(\d{3})/gim;
  const regexRule = /(\d{3}).(\d+)/gim;
  const regexSubrule = /(\d{3}).(\d+)([a-z]+)/gim;

  // Test if a chapter, rule, and subrule are referenced in text
  if (regexSubrule.test(linkText)) {
    linkText = findMatches(regexSubrule, linkText);
  }
  if (regexRule.test(linkText)) {
    linkText = findMatches(regexRule, linkText);
  }
  if (regexChapter.test(linkText)) {
    linkText = findMatches(regexChapter, linkText);
  }
  if (regexSection.test(linkText)) {
    linkText = findMatches(regexSection, linkText);
  }
  // Return original string or string with links
  return linkText;
};

export default parseLink;
