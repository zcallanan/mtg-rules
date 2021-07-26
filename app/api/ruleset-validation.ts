import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next"


const cors = Cors({
  methods: ["GET"],
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

interface Data {
    status: string;
}

// Fetch proxy for evaluation of new ruleset link
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>): Promise<void> {
  // Add CORS headers to response
  await runMiddleware(req, res, cors);

  // Get data from GET headers
  const { year, version } = req.headers;

  // Get data from new ruleset page
  const url = `https://media.wizards.com/${year}/downloads/MagicCompRules%${version}.txt`;
  const result = await fetch(url);
  const response = await result.text();

  // eslint complains due to the condition, but this is is the api response
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  response === "Not found\n"
    ? res.status(404).json({ status: "0" })
    : res.status(200).json({ status: "1" });
}