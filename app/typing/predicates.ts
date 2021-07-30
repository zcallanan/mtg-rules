import { Section, Chapter, Rule, Subrule } from "./types";

export const isSection = (
  node: Section | Chapter | Rule | Subrule
): node is Section => {
  return (node as Section).type === "section";
};

export const isChapter = (
  node: Section | Chapter | Rule | Subrule
): node is Chapter => {
  return (node as Chapter).type === "chapter";
};

export const isRule = (
  node: Section | Chapter | Rule | Subrule
): node is Rule => {
  return (node as Rule).type === "rule";
};

export const isSubrule = (
  node: Section | Chapter | Rule | Subrule
): node is Subrule => {
  return (node as Subrule).type === "subrule";
};
