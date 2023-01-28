import * as protocol from "@network-goods/hypercerts-protocol";
import { SentinelClient } from "defender-sentinel-client";

const { HypercertMinterABI } = protocol;

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
      network: "mumbai",
      confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
      name,
      addresses: [address],
      abi: JSON.stringify(HypercertMinterABI),
      paused: false,
      eventConditions: [],
      functionConditions: [
        { functionSignature: "createAllowlist(uint256,bytes32,string,enum)" },
      ],
      txCondition: "success",
      alertTimeoutMs: 0,
      notificationChannels: [notificationID],
    })
    .then((res) => {
      console.log(`Created sentinel: `);
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
};
