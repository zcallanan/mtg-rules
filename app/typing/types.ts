import { ReactNodeArray } from "react";

export interface Section {
  sectionNumber: number;
  text: string;
  type: string;
}

export interface Chapter {
  chapterNumber: number;
  sectionNumber: number;
  text: string;
  type: string;
}

export interface Rule {
  chapterNumber: number;
  example: string[];
  exampleSearch: string[];
  ruleNumber: number;
  sectionNumber: number;
  text: string;
  type: string;
}

export interface Subrule {
  chapterNumber: number;
  example: string[];
  exampleSearch: string[];
  ruleNumber: number;
  sectionNumber: number;
  subruleLetter: string;
  text: string;
  type: string;
}

export interface RouterValues {
  version: string;
  year: string;
}

export interface ChapterValues {
  anchorValue: number;
  chapterNumber: number;
  ignoreCallbackNumber: number;
  source: string;
}

export interface ErrorData {
  reason: string;
  value: number;
}

export interface ParseLinkArgs {
  allChaptersN: string[];
  example?: string;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  routerValues: RouterValues;
  rule?: Rule;
  searchResults: SearchResults;
  subrule?: Subrule;
}

export interface ReplaceRuleNumbers {
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  routerValues: RouterValues;
  rule?: Rule;
  ruleNumberArray: string[];
  subrule?: Subrule;
  text: string;
}

export interface ParseExample {
  exampleTextArray: string[];
  mainText: string;
}

export interface DynamicProps {
  effectiveDate: string;
  nodes: RulesParse;
}

export interface GetStaticPropsResult {
  notFound?: boolean;
  props: DynamicProps | Record<string, never>;
  revalidate?: number;
}

export interface GetStaticPropsParams {
  params: RouterValues;
}

export interface GetStaticPathsResult {
  fallback: boolean;
  paths: GetStaticPropsParams[];
}

export interface ValidateChapter {
  nodes: RulesParse;
  validChapter: Chapter | undefined | boolean;
}

export interface RulesParse {
  chapters: Chapter[];
  rules: Rule[];
  sections: Section[];
  subrules: Subrule[];
}

export interface SearchFormValue {
  searchTerm: string;
  searchType: string;
  submitted: number;
  validated: number;
}

export interface SearchData {
  chapters: Chapter[];
  previousSearchTerm: string;
  rules: Rule[];
  searchCleared: number;
  searchCompleted: number;
  searchTerm: string;
  searchType: string;
  sections: Section[];
  subrules: Subrule[];
}

export interface SearchResults {
  searchChapters: Chapter[];
  searchResult: number;
  searchRules: Rule[];
  searchSections: Section[];
  searchSubrules: Subrule[];
  searchTerm: string;
  searchType: string;
}

export interface SearchModifyArgs {
  rule?: Rule;
  searchResults: SearchResults;
  subrule?: Subrule;
  toModify: string | ReactNodeArray;
}

export interface ExampleModifyArgs {
  exampleText: string | ReactNodeArray;
  rule?: Rule;
  subrule?: Subrule;
}

export interface RadioCheck {
  exact: boolean;
  partial: boolean;
}

export interface ClickData {
  chapterN: number;
  dataSource: string;
}

export interface ScrollRules {
  hash: string;
  previousSearchTerm: string;
  promptScrollToRule: number;
  searchTerm: string;
}

export interface RuleScrollData {
  rulesInUse: Rule[];
  ruleNumbers: HTMLSpanElement[];
}

export interface TocScrollData {
  chaptersInUse: Chapter[];
  tocDivs: HTMLDivElement[];
}
