import { ParseExample } from "../typing/types";

const parseExamples = (text: string): ParseExample => {
  // Split example text
  const splitText: string[] = text.split("\r\n");

  // Separate main string from potential examples
  const mainText: string = splitText.splice(0, 1)[0];

  // Create an array of example text
  const exampleTextArray: string[] = splitText
    ? splitText.map((example) => example)
    : [];

  // Return ParseExample object
  return {
    mainText,
    exampleTextArray,
  };
};

export default parseExamples;
