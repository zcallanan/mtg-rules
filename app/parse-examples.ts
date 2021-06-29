const parseExamples = (text: string): string[] => {
  // Split example text
  const splitText: string[] = text.split('\r\n');

  // Get main string
  const mainText: string = splitText[0];

  // Remove main string from potential example text
  splitText.splice(0, 1);

  // Create an array of example text
  const exampleText: string[] = (splitText)
    ? splitText.map((example) => example)
    : [];

  // Return
  return [mainText, exampleText];
};

export default parseExamples;
