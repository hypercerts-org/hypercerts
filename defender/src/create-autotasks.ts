import { AutotaskClient } from "defender-autotask-client";
import { apiKey, apiSecret } from "./config.js";
import { WebhookTrigger } from "defender-autotask-client/lib/models/autotask.js";

const credentials = {
  apiKey,
  apiSecret,
};

export const createTask = async (name: string) => {
  const client = new AutotaskClient(credentials);
  const config = {
    name,
    encodedZippedCode: await client.getEncodedZippedCodeFromFolder(
      "./build/relay/",
    ),
    paused: false,
    trigger: { type: "webhook" } as WebhookTrigger,
  };

  return await client
    .create(config)
    .then((res) => {
      console.log(`Created autotask: `);
      console.log(res);
      return res.autotaskId;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};
