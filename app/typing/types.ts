import { ReactNodeArray } from "react";

export interface Chapter {
  chapterNumber: number;
  sectionNumber: number;
  text: string;
  type: string;
}

export interface ChapterValues {
  anchorValue: number;
  chapterNumber: number;
  ignoreCallbackNumber: number;
  source: string;
}

export interface ClickData {
  chapterN: number;
  dataSource: string;
}

export interface DynamicProps {
  effectiveDate: string;
  nodes: RulesParse;
}

export interface ErrorData {
  reason: string;
  value: number;
}

export interface GetStaticPathsResult {
  fallback: boolean;
  paths: GetStaticPropsParams[];
}

export interface GetStaticPropsParams {
  params: RouterValues;
}

export interface GetStaticPropsResult {
  notFound?: boolean;
  props: DynamicProps | Record<string, never>;
  revalidate?: number;
}

export interface ParseAnchorLinks {
  allChaptersN: string[];
  example?: string;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  routerValues: RouterValues;
  rule?: Rule;
  searchResults: SearchResults;
  subrule?: Subrule;
}

export interface ParseExample {
  exampleTextArray: string[];
  mainText: string;
}

export interface RadioCheck {
  exact: boolean;
  partial: boolean;
}

export interface ReplaceAnchorLinks {
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  routerValues: RouterValues;
  rule?: Rule;
  ruleNumberArray: string[];
  subrule?: Subrule;
  text: string;
}

export interface ReplaceExampleTextArgs {
  exampleText: string | ReactNodeArray;
  rule?: Rule;
  subrule?: Subrule;
}

export interface ReplaceSearchTermArgs {
  rule?: Rule;
  searchResults: SearchResults;
  subrule?: Subrule;
  toModify: string | ReactNodeArray;
}

export interface ReplaceTextArgs {
  allChaptersN: string[];
  example?: string;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  routerValues: RouterValues;
  rule?: Rule;
  searchResults: SearchResults;
  subrule?: Subrule;
}

export interface ReplaceUrlLinksArgs {
  rule?: Rule;
  subrule?: Subrule;
  toModify: string | ReactNodeArray;
}

export interface RouterValues {
  version: string;
  year: string;
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

export interface RuleScrollData {
  rulesInUse: Rule[];
  ruleNumbers: HTMLSpanElement[];
}

export interface RulesParse {
  chapters: Chapter[];
  rules: Rule[];
  sections: Section[];
  subrules: Subrule[];
}

export interface ScrollRules {
  hash: string;
  previousSearchTerm: string;
  promptScrollToRule: number;
  searchTerm: string;
}

export interface SearchData {
  chapters: Chapter[];
  previousSearchTerm: string;
  previousSearchType: string;
  rules: Rule[];
  searchCleared: number;
  searchCompleted: number;
  searchTerm: string;
  searchType: string;
  sections: Section[];
  subrules: Subrule[];
}

export interface SearchFormValue {
  searchTerm: string;
  searchType: string;
  submitted: number;
  validated: number;
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

export interface Section {
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

export interface TocScrollData {
  chaptersInUse: Chapter[];
  tocDivs: HTMLDivElement[];
}

export interface ValidateChapter {
  nodes: RulesParse;
  validChapter: Chapter | undefined | boolean;
}
