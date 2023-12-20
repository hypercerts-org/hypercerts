import { abi } from "./HypercertMinterABI.js";
import config from "./config.js";
import { NetworkConfig } from "./networks";
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
  overrideContractAddress,
  overrideABI,
}: {
  name: string;
  network: NetworkConfig;
  autotaskID: string;
  eventConditions?: EventCondition[];
  functionConditions?: FunctionCondition[];
  overrideContractAddress?: string;
  overrideABI?: any;
}) => {
  const client = new SentinelClient(config.credentials);
  const contractAddress = overrideContractAddress || network.contractAddress;
  await client
    .create({
      type: "BLOCK",
      network: network.networkKey,
      confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
      name,
      addresses: [contractAddress],
      abi: overrideABI || abi,
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
        contractAddress,
        "- linked to autotask",
        autotaskID,
      );
      return res;
    })
    .catch((error) => {
      console.error(error);
    });
};
