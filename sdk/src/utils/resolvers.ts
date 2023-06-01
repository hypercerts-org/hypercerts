import { Resolvers } from "../../.graphclient/index.js";

export const resolvers: Resolvers = {
  Claim: {
    chainName: (root, args, context) => context.chainName || "hypercerts-testnet", // The value we provide in the config
  },
  ClaimToken: {
    chainName: (root, args, context) => context.chainName || "hypercerts-testnet", // The value we provide in the config
  },
};
