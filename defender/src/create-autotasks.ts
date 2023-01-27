import { AutotaskClient } from "defender-autotask-client";
import { WebhookTrigger } from "defender-autotask-client/lib/models/autotask";
import { apiKey, apiSecret } from "./config";

const credentials = {
  apiKey,
  apiSecret,
};

const client = new AutotaskClient(credentials);
export const createTask = async (name: string) => {
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
