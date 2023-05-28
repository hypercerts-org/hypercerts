import { fetchGithubRepo } from "@hypercerts-org/os-observer";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = fetchGithubRepo();
  res.status(200).json(result);
}
