import { SentinelClient } from "defender-sentinel-client";
import { abi } from "./HypercertMinterABI.js";
import {
  EventCondition,
  FunctionCondition,
} from "defender-sentinel-client/lib/models/subscriber.js";

const credentials = {
  apiKey: process.env.ADMIN_API_KEY,
  apiSecret: process.env.ADMIN_API_SECRET,
};

const client = new SentinelClient(credentials);
// export const createAllowlistCreatedSentinel = async (
//   address: string,
//   autotaskID: string,
// ) => {
//   await client
//     .create({
//       type: "BLOCK",
//       network: "goerli",
//       confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
//       name: "AllowlistCreated",
//       addresses: [address],
//       abi: abi,
//       paused: false,
//       eventConditions: [
//         { eventSignature: "AllowlistCreated(uint256,bytes32)" },
//       ],
//       functionConditions: [
//         // { functionSignature: "createAllowlist(uint256,bytes32,string,uint8)" },
//       ],
//       alertTimeoutMs: 0,
//       notificationChannels: [],
//       autotaskTrigger: autotaskID,
//     })
//     .then((res) => {
//       console.log(`Created sentinel`, res.name);
//       return res;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };
//
// export const createBatchMintClaimsFromAllowlistsSentinel = async (
//   address: string,
//   autotaskID: string,
// ) => {
//   await client
//     .create({
//       type: "BLOCK",
//       network: "goerli",
//       confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
//       name: "AllowlistCreated",
//       addresses: [address],
//       abi: abi,
//       paused: false,
//       eventConditions: [
//         { eventSignature: "AllowlistCreated(uint256,bytes32)" },
//       ],
//       functionConditions: [
//         // { functionSignature: "createAllowlist(uint256,bytes32,string,uint8)" },
//       ],
//       alertTimeoutMs: 0,
//       notificationChannels: [],
//       autotaskTrigger: autotaskID,
//     })
//     .then((res) => {
//       console.log(`Created sentinel`, res.name);
//       return res;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

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
      abi: abi,
      paused: false,
      eventConditions,
      functionConditions,
      alertTimeoutMs: 0,
      notificationChannels: [],
      autotaskTrigger: autotaskID,
    })
    .then((res) => {
      console.log(`Created sentinel`, res.name, "monitoring address", address);
      return res;
    })
    .catch((error) => {
      console.error(error);
    });
};
