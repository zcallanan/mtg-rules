const parseExamples = (text: string): (string | string[])[] => {
  // Split example text
  const splitText: string[] = text.split("\r\n");

  // Separate main string from potential examples
  const mainText: string = splitText.splice(0, 1)[0];

  // Create an array of example text
  const exampleText: string[] = splitText
    ? splitText.map((example) => example)
    : [];

  // Result
  const result: (string | string[])[] = [];
  result.push(mainText);
  result.push(exampleText)

  // Return
  return result;
};

export default parseExamples;
