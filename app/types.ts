export interface Section {
  type: string;
  text: string;
  sectionNumber: number;
}

export interface Chapter {
  type: string;
  text: string;
  sectionNumber: number;
  chapterNumber: number;
}

export interface Rule {
  type: string;
  text: string;
  sectionNumber: number;
  chapterNumber: number;
  ruleNumber: number;
  example: string[];
}

export interface Subrule {
  type: string;
  text: string;
  sectionNumber: number;
  chapterNumber: number;
  ruleNumber: number;
  subruleLetter: string;
  example: string[];
}

export interface RouterValues {
  year: string;
  version: string;
}

export interface ChapterValues {
  currentCallback: number;
  chapterNumber: number;
  anchorValue: number;
  init: number;
  source: string;
  propValue: number;
}

export interface ErrorData {
  reason: string;
  value: number;
}

export interface ParseLinkArgs {
  routerValues: RouterValues;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  example?: string;
  rule?: Rule;
  subrule?: Subrule;
}

export interface ReplaceRuleNumbers {
  text: string;
  ruleNumberArray: string[];
  routerValues: RouterValues;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  rule?: Rule;
  subrule?: Subrule;
}

export interface ParseExample {
  mainText: string;
  exampleTextArray: string[];
}

export interface DynamicProps {
  nodes: RulesParse;
  effectiveDate: string;
}

export interface GetStaticPropsResult {
  props: DynamicProps | {};
  revalidate?: number;
  notFound?: boolean;
}

export interface ValidateChapter {
  nodes: RulesParse;
  validChapter: Chapter | undefined | boolean;
}

export interface RulesParse {
  sections: Section[],
  chapters: Chapter[],
  rules: Rule[],
  subrules: Subrule[],
}
