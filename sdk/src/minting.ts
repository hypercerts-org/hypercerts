import { BigNumberish, ethers } from "ethers";
import { provider } from "./utils/provider.js";
import * as protocol from "@network-goods/hypercerts-protocol";
import { validateMetaData } from "./validator/index.js";
import { HypercertMetadata } from "./types/metadata.js";
import { storeMetadata } from "./operator/index.js";

// TODO dynamic addresses and provider
const hypercertMinter = <protocol.HypercertMinter>(
  new ethers.Contract("0xcC08266250930E98256182734913Bf1B36102072", protocol.HypercertMinterABI, provider)
);

// TODO error handling
// TODO Automagic checking on mapping transferRestrictions -> value and effect
export const mintHypercertToken = async (
  claimData: HypercertMetadata,
  totalUnits: BigNumberish,
  transferRestriction: BigNumberish,
) => {
  if (validateMetaData(claimData)) {
    // store metadata on IPFS
    const cid = await storeMetadata(claimData);

    // mint hypercert token
    return hypercertMinter.mintClaim(totalUnits, cid, transferRestriction);
  } else {
    console.log("Incorrect metadata");
  }
};

export const transferRestrictions = {
  AllowAll: 0,
  FromCreatorOnly: 1,
  DisallowAll: 2,
} as const;
