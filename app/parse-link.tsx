import Link from "next/link";
import reactStringReplace from "react-string-replace";
import { Rule, Subrule, RouterValues } from "./types";

const element = (
  updatedText: string,
  ruleNumber: string,
  routerValues: RouterValues,
  obj: Rule | Subrule,
  onLinkClick: (chapterNumber: number) => number,
): string => reactStringReplace(updatedText, ruleNumber, (match, i) => {
  // Convert section digits to the first chapter value of a section
  const chapterValue = (/\d{3}/.test(ruleNumber))
    ? Number(ruleNumber.match(/\d{3}/)[0])
    : Number(ruleNumber) * 100;

  return (
    <span
      key={
        obj.type === "rule"
          ? `${obj.ruleNumber}-${ruleNumber}-${i}`
          : `${obj.ruleNumber}${obj.subruleLetter}-${ruleNumber}-${i}`
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
  );
});

const parseLink = (
  obj: Rule | Subrule,
  routerValues: RouterValues,
  onLinkClick: (chapterNumber: number) => number,
  exampleText = "",
): string | JSX.element => {
  let linkText: string = exampleText || obj.text;

  // Regex
  const regexSection = /section\s+(\d)/gim;
  // Include extra characters to avoid creating links on erroneous numbers, ex: 2011
  const regexChapter = /\s+(\d{3})[\s,.;]/gim;
  const regexRule = /(\d{3})\.(\d+)/gim;
  const regexSubrule = /(\d{3})\.(\d+)([a-z]+)/gim;
  const regexes = [regexSubrule, regexRule, regexChapter, regexSection];

  const findMatches = (
    regex: RegExp,
    text: string | JSX.Element,
  ): string | JSX.Element => {
    let updatedText = text;

    // Get string matches
    const matchArray: string[] = (exampleText)
      ? exampleText.match(regex)
      : obj.text.match(regex);

    // Remove extra characters from matchArray
    matchArray.forEach((ruleNumber, i) => {
      // Remove /section\s+/ from matchArray
      if (ruleNumber.includes("section")) {
        matchArray[i] = ruleNumber.replace(/section\s+/, "");
      }

      // TODO: Prevent invalid chapter values like 999
      // Remove extra characters from chapter ruleNumbers
      if (/\s|\.|,|;|-|:/.test(ruleNumber) && (regexChapter).test(ruleNumber)) {
        matchArray[i] = ruleNumber.replace(/\s|\.|,|;|-|:/g, "");
      }
    });

    // Cycle through text for each rule number string, replacing number with jsx
    matchArray.forEach((ruleNumber) => {
      updatedText = element(updatedText, ruleNumber, routerValues, obj, onLinkClick);
    });
    return updatedText;
  };

  // Test if subrule, rule, chapter, and section numbers appear in text
  regexes.forEach((regex) => {
    if (regex.test(linkText)) {
      linkText = findMatches(regex, linkText);
    }
  });

  // Return original string or string with links
  return linkText;
};

export default parseLink;
