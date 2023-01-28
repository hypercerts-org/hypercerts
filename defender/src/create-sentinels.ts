import { SentinelClient } from "defender-sentinel-client";
import { abi } from "./HypercertMinterABI.js";

const credentials = {
  apiKey: process.env.ADMIN_API_KEY,
  apiSecret: process.env.ADMIN_API_SECRET,
};

export const client = new SentinelClient(credentials);
export const createMintClaimSentinel = async (
  name: string,
  address: string,
  notificationID: string,
  autotaskID: string,
) => {
  await client
    .create({
      type: "BLOCK",
      network: "goerli",
      confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
      name,
      addresses: [address],
      abi: abi,
      paused: false,
      eventConditions: [],
      functionConditions: [
        { functionSignature: "createAllowlist(uint256,bytes32,string,uint8)" },
      ],
      alertTimeoutMs: 0,
      notificationChannels: [notificationID],
      autotaskTrigger: autotaskID,
    })
    .then((res) => {
      console.log(`Created sentinel`, res.name);
      return res;
    })
    .catch((error) => {
      console.error(error);
    });
};
