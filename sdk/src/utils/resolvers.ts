import { Resolvers, MeshContext } from "../../.graphclient";

export const resolvers: Resolvers = {
  Claim: {
    chainName: (root, args, context, info) => context.chainName || "goerli", // The value we provide in the config
  },
  ClaimToken: {
    chainName: (root, args, context, info) => context.chainName || "goerli", // The value we provide in the config
  },
  // Query: {
  //   crossClaims: async (root, args, context, info) =>
  //     Promise.all(
  //       args.chainNames.map((chainName) =>
  //         context.Hypercerts.Query.claims({
  //           root,
  //           args,
  //           context: {
  //             ...context,
  //             chainName,
  //           },
  //           info,
  //         }).then((claims) =>
  //           // We send chainName here so we can take it in the resolver above
  //           claims.map((claim) => ({
  //             ...claim,
  //             chainName,
  //           })),
  //         ),
  //       ),
  //     ).then((allClaims) => allClaims.flat()),
  //   crossClaimTokens: async (root, args, context, info) =>
  //     Promise.all(
  //       args.chainNames.map((chainName) =>
  //         context.Hypercerts.Query.claimtokens({
  //           root,
  //           args,
  //           context: {
  //             ...context,
  //             chainName,
  //           },
  //           info,
  //         }).then((claimtokens) =>
  //           // We send chainName here so we can take it in the resolver above
  //           claimtokens.map((claimtoken) => ({
  //             ...claimtoken,
  //             chainName,
  //           })),
  //         ),
  //       ),
  //     ).then((allClaimTokens) => allClaimTokens.flat()),
  // },
};
