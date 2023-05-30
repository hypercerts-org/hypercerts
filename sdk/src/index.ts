// Validation
// Protocol
import * as protocol from "@hypercerts-org/contracts";

// Graph
import { execute } from "../.graphclient/index.js";
// Wrapper client
import HypercertClient from "./client.js";
import type { ClaimByIdQuery, ClaimTokensByClaimQuery } from "./global.js";
// Operations
import { HypercertMinting, HypercertsStorage } from "./operator/index.js";
import { claimById, claimsByOwner, firstClaims } from "./indexer/queries/claims.js";
import { fractionById, fractionsByClaim, fractionsByOwner } from "./indexer/queries/fractions.js";
import type { QueryParams } from "./indexer/utils.js";
import HypercertMinterABI from "./resources/HypercertMinter.js";
// Types
import type { HypercertClaimdata } from "./types/claimdata.js";
import { TransferRestrictions } from "./types/hypercerts.js";
import type { Allowlist, AllowlistEntry } from "./types/hypercerts.js";
import type { HypercertMetadata } from "./types/metadata.js";
import type { HypercertClientConfig } from "./types/client.js";
import { formatHypercertData } from "./utils/formatter.js";
import { validateAllowlist, validateClaimData, validateMetaData } from "./validator/index.js";

export type { QueryParams, HypercertClientConfig };
export { validateMetaData, validateClaimData, validateAllowlist, formatHypercertData };

export { HypercertClient, TransferRestrictions };

export { HypercertsStorage, HypercertMinting };

export { execute, claimsByOwner, claimById, firstClaims, fractionsByOwner, fractionsByClaim, fractionById };

const { HyperCertMinterFactory } = protocol;

export { HyperCertMinterFactory, HypercertMinterABI };

export type {
  HypercertMetadata,
  HypercertClaimdata,
  ClaimByIdQuery,
  ClaimTokensByClaimQuery,
  Allowlist,
  AllowlistEntry,
};
