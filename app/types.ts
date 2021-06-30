export interface SectionI {
  type: string;
  text: string;
  sectionNumber: number;
}

export interface ChapterI {
  type: string;
  text: string;
  sectionNumber: number;
  chapterNumber: number;
}

export interface RuleI {
  type: string;
  text: string;
  sectionNumber: number;
  chapterNumber: number;
  ruleNumber: number;
  example: string[];
}

export interface SubruleI {
  type: string;
  text: string;
  sectionNumber: number;
  chapterNumber: number;
  ruleNumber: number;
  subruleLetter: string;
  example: string[];
}

export interface NodesI {
  nodes: (SectionI|ChapterI|RuleI|SubruleI)[];
}

