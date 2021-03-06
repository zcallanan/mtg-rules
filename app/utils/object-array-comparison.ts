import { Rule, Chapter, Section } from "../typing/types";

// Comparison of object key array length and every property
const objectsEqual = (
  obj1: Rule | Section | Chapter,
  obj2: Rule | Section | Chapter
): boolean =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every((p) => obj1[p] === obj2[p]);

// Compare array length and every object
const objectArrayComparison = (
  array1: Rule[] | Section[] | Chapter[],
  array2: Rule[] | Section[] | Chapter[]
): boolean =>
  array1.length === array2.length &&
  array1.every((obj, i) => objectsEqual(obj, array2[i]));

export default objectArrayComparison;
