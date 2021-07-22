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

export interface Nodes {
  nodes: (Section | Chapter | Rule | Subrule)[];
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
}

export interface ErrorData {
  reason: string;
  value: number;
}
