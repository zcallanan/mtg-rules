import { Parser } from 'simple-text-parser';
import parseExamples from './parse-examples';

const rulesParse = async (rawText: string, i = 0) => {
  // Retry 3 times
  if (i < 4) {
    try {
      // Remove extra text
      const text: string = rawText.split("Glossary")[1];

      // Create parser
      const parser = new Parser();

      // Regex
      const sectionRegex = /^(\d).\s+(.+)[\r\n][\r\n]/gm;
      const chapterRegex = /^(\d{3}).\s+(.+)[\r\n][\r\n]/gm
      const ruleRegex = /^(\d{3})\.(\d+)\.\s+([\s\S]+?)[\r\n][\r\n][\r\n][\r\n]/gm;
      const subruleRegex = /^(\d{3}).(\d+)([a-z]+)\s+([\s\S]+?)[\r\n][\r\n][\r\n][\r\n]/gm;

      // Add rules
      parser.addRule(sectionRegex, (match, section, text) => {
        const sectionNumber: number = Number(section);

        return { type: 'section', text, sectionNumber };
      });
      parser.addRule(chapterRegex, (match, chapter, text) => {
        const sectionNumber: number = Number(chapter[0]);
        const chapterNumber: number = Number(chapter);

        return { type: 'chapter', text, sectionNumber, chapterNumber };
      });
      parser.addRule(ruleRegex, (match, chapter, rule, text) => {
        const sectionNumber: number = Number(chapter[0]);
        const chapterNumber: number = Number(chapter);
        const ruleNumber: number = Number(rule);

        // Handle text that has examples
        const textParse = parseExamples(text);

        return {
          type: 'rule',
          text: textParse[0],
          sectionNumber,
          chapterNumber,
          ruleNumber,
          example: textParse[1],
        };
      });
      parser.addRule(
        subruleRegex, (match, chapter, rule, subruleLetter, text) => {
          const sectionNumber = Number(chapter[2]);
          const chapterNumber = Number(chapter);
          const ruleNumber = Number(rule);

          // Handle text that has examples
          const textParse = parseExamples(text);

          return {
            type: 'subrule',
            text: textParse[0],
            sectionNumber,
            chapterNumber,
            ruleNumber,
            subruleLetter,
            example: textParse[1],
          };
        },
      );

      // Remove all not matched nodes
      const tree = parser.toTree(text).filter((node) => node.type !== 'text');

      // Return
      return tree;
    } catch (err) {
      console.error(err);

      i += 1;
      console.log(`Retry count: ${i}`);
      rulesParse(rawText, i);
    }
  }
}

export default rulesParse;


