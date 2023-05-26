// Validation
// Protocol
import * as protocol from "@hypercerts-org/hypercerts-protocol";

// Graph
import { execute } from "../.graphclient/index.js";
// Wrapper client
import HypercertClient from "./client.js";
import type { ClaimByIdQuery, ClaimTokensByClaimQuery } from "./global.js";
// Operations
import { HypercertMinting, HypercertsStorage } from "./operator/index.js";
import { claimById, claimsByOwner, firstClaims } from "./queries/claims.js";
import { fractionById, fractionsByClaim, fractionsByOwner } from "./queries/fractions.js";
import type { QueryParams } from "./queries/utils.js";
import HypercertMinterABI from "./resources/HypercertMinter.js";
// Types
import type { HypercertClaimdata } from "./types/claimdata.js";
import { TransferRestrictions } from "./types/hypercerts.js";
import type { Allowlist, AllowlistEntry } from "./types/hypercerts.js";
import type { HypercertMetadata } from "./types/metadata.js";
import { formatHypercertData } from "./utils/formatter.js";
import { validateAllowlist, validateClaimData, validateMetaData } from "./validator/index.js";

export type { QueryParams };
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
