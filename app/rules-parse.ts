import { Parser, Node } from "simple-text-parser";
import sortBy from "lodash/sortBy";
import parseExamples from "./parse-examples";
import { ParseExample, RulesParse, Section, Chapter, Rule, Subrule } from "./types";

const rulesParse = async (rawText: string, i = 0): Promise<RulesParse> => {
  // Retry 3 times
  if (i < 4) {
    try {
      // Remove extra text
      const text: string = rawText.split("Glossary")[1];

      // Create parser
      const parser = new Parser();

      // Regex
      const sectionRegex = /^(\d).\s+(.+)[\r\n][\r\n]/gm;
      const chapterRegex = /^(\d{3}).\s+(.+)[\r\n][\r\n]/gm;
      const ruleRegex = /^(\d{3})\.(\d+)\.\s+([\s\S]+?)[\r\n][\r\n][\r\n][\r\n]/gm;
      const subruleRegex = /^(\d{3}).(\d+)([a-z]+)\s+([\s\S]+?)[\r\n][\r\n][\r\n][\r\n]/gm;

      // Add rules
      parser.addRule(sectionRegex, (match, section, txt) => {
        const sectionNumber = Number(section);

        return { type: "section", text: txt, sectionNumber };
      });
      parser.addRule(chapterRegex, (match, chapter, txt) => {
        const sectionNumber = Number(chapter[0]);
        const chapterNumber = Number(chapter);

        return {
          type: "chapter",
          text: txt,
          sectionNumber,
          chapterNumber,
        };
      });
      parser.addRule(ruleRegex, (match, chapter, rule, txt) => {
        const sectionNumber = Number(chapter[0]);
        const chapterNumber = Number(chapter);
        const ruleNumber = Number(rule);

        // Handle text that has examples
        const textParse: ParseExample = parseExamples(txt);

        return {
          type: "rule",
          text: (textParse) ? textParse.mainText : "",
          sectionNumber,
          chapterNumber,
          ruleNumber,
          example: (textParse) ? textParse.exampleTextArray : "",
        };
      });
      parser.addRule(
        subruleRegex,
        (match, chapter, rule, subruleLetter, txt) => {
          const sectionNumber = Number(chapter[2]);
          const chapterNumber = Number(chapter);
          const ruleNumber = Number(rule);

          // Handle text that has examples
          const textParse: ParseExample = parseExamples(txt);

          return {
            type: "subrule",
            text: (textParse) ? textParse.mainText : "",
            sectionNumber,
            chapterNumber,
            ruleNumber,
            subruleLetter,
            example: (textParse) ? textParse.exampleTextArray : "",
          };
        },
      );

      // Remove all not matched nodes
      const tree = parser.toTree(text).filter((node) => node.type !== "text");

      // Filter nodes
      const sectionNodes: Node[] = sortBy(
        tree.filter((node) => node.type === "section"),
        ["sectionNumber"],
      );
      const chapterNodes: Node[] = sortBy(
        tree.filter((node) => node.type === "chapter"),
        ["sectionNumber", "chapterNumber"],
      );
      const rules: Node[] = tree.filter((node) => node.type === "rule");
      const subrules: Node[] = tree.filter((node) => node.type === "subrule");

      // Return
      return {
        sections: (sectionNodes as any) as Section[],
        chapters: (chapterNodes as any) as Chapter[],
        rules: (rules as any) as Rule[],
        subrules: (subrules as any) as Subrule[],
      }
    } catch (err) {
      console.error(err);

      let val = i;
      val += 1;
      rulesParse(rawText, val);
    }
  }
  return null;
};

export default rulesParse;
