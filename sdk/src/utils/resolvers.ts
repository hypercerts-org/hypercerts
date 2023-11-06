import { Resolvers } from "../../.graphclient";

export const resolvers: Resolvers = {
  Claim: {
    chainName: (root, args, context) => context.chainName, // The value we provide in the config
  },
  ClaimToken: {
    chainName: (root, args, context) => context.chainName, // The value we provide in the config
  },
};
