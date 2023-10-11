import { abi } from "./HypercertMinterABI.js";
import config from "./config.js";
import { NetworkConfig } from "./networks.js";
import { SentinelClient } from "@openzeppelin/defender-sentinel-client";
import {
  EventCondition,
  FunctionCondition,
} from "@openzeppelin/defender-sentinel-client/lib/models/subscriber.js";

export const createSentinel = async ({
  name,
  network,
  autotaskID,
  functionConditions = [],
  eventConditions = [],
}: {
  name: string;
  network: NetworkConfig;
  autotaskID: string;
  eventConditions?: EventCondition[];
  functionConditions?: FunctionCondition[];
}) => {
  const client = new SentinelClient(config.credentials);
  await client
    .create({
      type: "BLOCK",
      network: network.networkKey,
      confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
      name,
      addresses: [network.contractAddress],
      abi: abi,
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
        network.contractAddress,
        "- linked to autotask",
        autotaskID,
      );
      return res;
    })
    .catch((error) => {
      console.error(error);
    });
};
