// Validation
import { validateMetaData, validateClaimData } from "./validator/index.js";
import { formatHypercertData } from "./formatter.js";
import { storeMetadata, storeData, getMetadata, getData, deleteMetadata } from "./operator/index.js";

export {
  validateMetaData,
  validateClaimData,
  storeMetadata,
  storeData,
  getMetadata,
  getData,
  deleteMetadata,
  formatHypercertData,
};

// Graph
import { execute } from "./.graphclient/index.js";
import { claimsByOwner, claimById, firstClaims } from "./claims.js";
import { fractionsByOwner, fractionsByClaim, fractionById } from "./fractions.js";

export { execute, claimsByOwner, claimById, firstClaims, fractionsByOwner, fractionsByClaim, fractionById };

// Protocol
import * as protocol from "@network-goods/hypercerts-protocol";

const { HyperCertMinterFactory, HypercertMinterABI } = protocol;

export { HyperCertMinterFactory, HypercertMinterABI };

// Types
import type { HypercertClaimdata } from "./types/claimdata.js";
import type { HypercertMetadata } from "./types/metadata.js";

export type { HypercertMetadata, HypercertClaimdata };
