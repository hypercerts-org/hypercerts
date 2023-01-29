import { SentinelClient } from "defender-sentinel-client";
import { abi } from "./HypercertMinterABI.js";

const credentials = {
  apiKey: process.env.ADMIN_API_KEY,
  apiSecret: process.env.ADMIN_API_SECRET,
};

export const client = new SentinelClient(credentials);
export const createAllowlistCreatedSentinel = async (
  address: string,
  autotaskID: string,
) => {
  await client
    .create({
      type: "BLOCK",
      network: "goerli",
      confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
      name: "AllowlistCreated",
      addresses: [address],
      abi: abi,
      paused: false,
      eventConditions: [
        { eventSignature: "AllowlistCreated(uint256,bytes32)" },
      ],
      functionConditions: [
        // { functionSignature: "createAllowlist(uint256,bytes32,string,uint8)" },
      ],
      alertTimeoutMs: 0,
      notificationChannels: [],
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
