import { Resolvers } from "../../.graphclient";

export const resolvers: Resolvers = {
  Claim: {
    graphName: (root, args, context) => context.graphName, // The value we provide in the config
  },
  ClaimToken: {
    graphName: (root, args, context) => context.graphName, // The value we provide in the config
  },
};
