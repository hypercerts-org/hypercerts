import { AutotaskClient } from "defender-autotask-client";
import { apiKey, apiSecret } from "./config.js";
import { SentinelTrigger } from "defender-autotask-client/lib/models/autotask.js";

const credentials = {
  apiKey,
  apiSecret,
};

export const createTask = async (name: string, file: string) => {
  const client = new AutotaskClient(credentials);
  const config = {
    name,
    encodedZippedCode: await client.getEncodedZippedCodeFromFolder(
      `./build/relay/${file}`,
    ),
    paused: false,
    trigger: { type: "sentinel" } as SentinelTrigger,
  };

  return await client
    .create(config)
    .then((res) => {
      console.log(`Created autotask: `, res.autotaskId);
      return res;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};
