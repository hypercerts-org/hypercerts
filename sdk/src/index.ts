// Validation
import { validateMetaData, validateClaimData } from "./validator/index.js";
import { formatHypercertData } from "./utils/formatter.js";
// import { xx, storeData, getMetadata, getData } from "./operator/index.js";
import { HypercertsStorage } from "./operator/hypercerts-storage.js";

export {
  validateMetaData,
  validateClaimData,
  formatHypercertData,
  HypercertsStorage,
};

// Graph
import { execute } from "../.graphclient/index.js";
import { claimsByOwner, claimById, firstClaims } from "./queries/claims.js";
import { fractionsByOwner, fractionsByClaim, fractionById } from "./queries/fractions.js";

export { execute, claimsByOwner, claimById, firstClaims, fractionsByOwner, fractionsByClaim, fractionById };

// Protocol
import * as protocol from "@hypercerts-org/hypercerts-protocol";
const { HyperCertMinterFactory, HypercertMinterABI } = protocol;
import { TransferRestrictions } from "./minting.js";

export { HyperCertMinterFactory, HypercertMinterABI, TransferRestrictions };

// Types
import type { HypercertClaimdata } from "./types/claimdata.js";
import type { HypercertMetadata } from "./types/metadata.js";

export type { HypercertMetadata, HypercertClaimdata };
