const dev = process.env.NODE_ENV !== "production";

const formValidation = async (url: string, version: string, year: string): Promise<number> => {
  // Remove host
  const noHost: string = url.replace(/http(s|):\/\//i, "");
  const split: string[] = noHost.replace(`${version}`, "").split("/");

  // If it is an invalid ruleset url
  const re1 = /media\.wizards\.com/i;
  const path1: string = re1.test(split[0]) ? split[0].match(re1)[0] : "";

  const re2 = /downloads/i;
  const path2: string = re2.test(split[2]) ? split[2].match(re2)[0] : "";

  const re3 = /MagicCompRules%.txt/i;
  const path3: string = re3.test(split[3]) ? split[3].match(re3)[0] : "";

  if (!path1 || !year || !path2 || !path3 || !version) {
    // Url invalid
    return 2;
  }

  const versionString = `${version}`;
  const yearString = `${year}`;

  const result = await (dev
    ? fetch("/api/ruleset-validation",
      {
        headers:
          {
            version: versionString,
            year: yearString,
          },
      })
    : fetch(url)
  );
  console.log(result);
  console.log(result.status);
  return result.status;
};

export default formValidation;
