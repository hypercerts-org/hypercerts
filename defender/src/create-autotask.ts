import config from "./config";
import { AutotaskClient } from "@openzeppelin/defender-autotask-client";
import { SentinelTrigger } from "@openzeppelin/defender-autotask-client/lib/models/autotask.js";

export const createTask = async (name: string, file: string) => {
  const client = new AutotaskClient(config.credentials);
  const taskConfig = {
    name,
    encodedZippedCode: await client.getEncodedZippedCodeFromFolder(
      `./build/relay/${file}`,
    ),
    paused: false,
    trigger: { type: "sentinel" } as SentinelTrigger,
  };

  return await client
    .create(taskConfig)
    .then((res) => {
      console.log("Created autotask", name, "with id", res.autotaskId);
      return res;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};
