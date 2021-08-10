const rulesetUrlValidation = async (
  url: string,
  version: string,
  year: string
): Promise<Response> => {
  const versionString = `${version}`;
  const yearString = `${year}`;

  const result = fetch("/api/ruleset-validation", {
    headers: {
      version: versionString,
      year: yearString,
    },
  });
  if (process.env.NODE_ENV !== "production") {
    console.log(result);
  }

  return result;
};

export default rulesetUrlValidation;
