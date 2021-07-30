import { ReactNodeArray } from "react";

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
  exampleSearch: string[];
}

export interface Subrule {
  type: string;
  text: string;
  sectionNumber: number;
  chapterNumber: number;
  ruleNumber: number;
  subruleLetter: string;
  example: string[];
  exampleSearch: string[];
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
  searchResults: SearchResults;
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
  props: DynamicProps | Record<string, never>;
  revalidate?: number;
  notFound?: boolean;
}

export interface GetStaticPropsParams {
  params: RouterValues;
}

export interface GetStaticPathsResult {
  paths: GetStaticPropsParams[];
  fallback: boolean;
}

export interface ValidateChapter {
  nodes: RulesParse;
  validChapter: Chapter | undefined | boolean;
}

export interface RulesParse {
  sections: Section[];
  chapters: Chapter[];
  rules: Rule[];
  subrules: Subrule[];
}

export interface SearchValue {
  searchTerm: string;
  submitted: number;
  validated: number;
}

export interface SearchResults {
  searchTerm: string;
  searchSections: Section[];
  searchChapters: Chapter[];
  searchRules: Rule[];
  searchSubrules: Subrule[];
  searchResult: number;
}

export interface SearchData {
  searchTerm: string;
  searchCompleted: number;
  sections: Section[];
  chapters: Chapter[];
  rules: Rule[];
  subrules: Subrule[];
}

export interface ModifyArgs {
  searchTerm: string;
  rule?: Rule;
  subrule?: Subrule;
  toModify: string | ReactNodeArray;
}
