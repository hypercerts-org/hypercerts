import { client } from "./client";
import { HypercertMinterABI } from "@network-goods/hypercerts-protocol";

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
      abi: HypercertMinterABI,
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
