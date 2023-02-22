import { SentinelClient } from "defender-sentinel-client";
import * as protocol from "@hypercerts-org/hypercerts-protocol";
const { HypercertMinterABI } = protocol;
import {
  EventCondition,
  FunctionCondition,
} from "defender-sentinel-client/lib/models/subscriber.js";
import { apiKey, apiSecret } from "./config.js";

const credentials = {
  apiKey: apiKey,
  apiSecret: apiSecret,
};

const client = new SentinelClient(credentials);

export const createSentinel = async ({
  address,
  name,
  autotaskID,
  functionConditions = [],
  eventConditions = [],
}: {
  name: string;
  address: string;
  autotaskID: string;
  eventConditions?: EventCondition[];
  functionConditions?: FunctionCondition[];
}) => {
  await client
    .create({
      type: "BLOCK",
      network: "goerli",
      confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
      name,
      addresses: [address],
      abi: JSON.stringify(HypercertMinterABI),
      paused: false,
      eventConditions,
      functionConditions,
      alertTimeoutMs: 0,
      notificationChannels: [],
      autotaskTrigger: autotaskID,
    })
    .then((res) => {
      console.log(
        `Created sentinel`,
        res.name,
        "- monitoring address",
        address,
        "- linked to autotask",
        autotaskID,
      );
      return res;
    })
    .catch((error) => {
      console.error(error);
    });
};
