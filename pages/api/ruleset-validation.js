import Cors from "cors";

const cors = Cors({
  methods: ["GET"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Fetch proxy for evaluation of new ruleset link
export default async function handler(req, res) {
  // Add CORS headers to response
  await runMiddleware(req, res, cors);

  // Get data from GET headers
  const year = req.headers["year"];
  const version = req.headers["version"];

  // Get data from new ruleset page
  const url = `https://media.wizards.com/${year}/downloads/MagicCompRules%${version}.txt`;
  const result = await fetch(url);
  const response = await result.text();

  // API response
  response === "Not found\n"
    ? res.status(404).json({ status: "0" })
    : res.status(200).json({ status: "1" });
}
