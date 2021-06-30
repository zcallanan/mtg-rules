const parseExamples = (text: string): string[] => {
  // Split example text
  const splitText: string[] = text.split('\r\n');

  // Separate main string from potential examples
  const mainText: string = splitText.splice(0, 1)[0];

  // Create an array of example text
  const exampleText: string[] = (splitText)
    ? splitText.map((example) => example)
    : [];

  // Return
  return [mainText, exampleText];
};

export default parseExamples;
