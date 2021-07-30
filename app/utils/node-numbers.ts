import { isSection, isChapter, isRule, isSubrule } from "../typing/predicates";
import { Section, Chapter, Rule, Subrule } from "../typing/types";

const nodeNumbers = (
  nodes: Section[] | Chapter[] | Rule[] | Subrule[]
): string[] => {
  // Returns the "ruleNumber" for a node, such as 3, 300, 301.1, or 301.1b
  const result = nodes.map((node) => {
    let x: string;
    if (isSection(node)) {
      x = node.sectionNumber.toString();
    } else if (isChapter(node)) {
      x = node.chapterNumber.toString();
    } else if (isRule(node)) {
      x = `${node.chapterNumber}.${node.ruleNumber}`;
    } else if (isSubrule(node)) {
      x = `${node.chapterNumber}.${node.ruleNumber}${node.subruleLetter}`;
    }
    return x;
  });
  return result;
};

export default nodeNumbers;
