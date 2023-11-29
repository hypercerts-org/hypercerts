import { Resolvers } from "../../.graphclient";

const resolvers: Resolvers = {
  Claim: {
    graphName: (root, args, context) => root.graphName || context.graphName || "hypercerts-testnet", // The value we provide in the config
  },
  ClaimToken: {
    graphName: (root, args, context) => root.graphName || context.graphName || "hypercerts-testnet", // The value we provide in the config
  },
};

export { resolvers };
