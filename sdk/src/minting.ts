import { BigNumberish, ethers } from "ethers";
import { provider } from "./utils/provider.js";
import * as protocol from "@hypercerts-org/hypercerts-protocol";
import { validateMetaData } from "./validator/index.js";
import { HypercertMetadata } from "./types/metadata.js";
import { storeMetadata } from "./operator/index.js";

/**
 * COMMENTING THIS OUT FOR NOW - breaks the build
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
    //return hypercertMinter.mintClaim(totalUnits, cid, transferRestriction);
  } else {
    console.log("Incorrect metadata");
  }
};
*/

export const TransferRestrictions = {
  AllowAll: 0,
  DisallowAll: 1,
  FromCreatorOnly: 2,
} as const;
