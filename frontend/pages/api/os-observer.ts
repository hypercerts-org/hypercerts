import { NpmDownloadsArgs, npmDownloads } from "@hypercerts-org/os-observer";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const args: Partial<NpmDownloadsArgs> = req.query;
  // TODO: generic validation
  const { name } = args;
  if (!name) {
    res.status(400).json({ error: "packageName is required" });
    return;
  }

  const result = await npmDownloads({ name });
  res.status(200).json(result);
}
