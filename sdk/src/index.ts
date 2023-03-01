// Validation
import { validateMetaData, validateClaimData } from "./validator/index.js";
import { formatHypercertData } from "./utils/formatter.js";

export { validateMetaData, validateClaimData, formatHypercertData };

// Operations
import { HypercertsStorage, HypercertMinting } from "./operator/index.js";

export { HypercertsStorage, HypercertMinting };

// Graph
import { execute } from "../.graphclient/index.js";
import { claimsByOwner, claimById, firstClaims } from "./queries/claims.js";
import { fractionsByOwner, fractionsByClaim, fractionById } from "./queries/fractions.js";

export { execute, claimsByOwner, claimById, firstClaims, fractionsByOwner, fractionsByClaim, fractionById };

// Protocol
import * as protocol from "@hypercerts-org/hypercerts-protocol";
import HypercertMinterABI from "./resources/HypercertMinter.js";
const { HyperCertMinterFactory } = protocol;

export { HyperCertMinterFactory, HypercertMinterABI };

// Types
import type { HypercertClaimdata } from "./types/claimdata.js";
import type { HypercertMetadata } from "./types/metadata.js";

export type { HypercertMetadata, HypercertClaimdata };
