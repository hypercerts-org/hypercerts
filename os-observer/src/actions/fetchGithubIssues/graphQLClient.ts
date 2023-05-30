import { GraphQLClient } from "graphql-request";
import { GITHUB_GRAPHQL_API, GITHUB_TOKEN } from "../../config.js";

export const graphQLClient = new GraphQLClient(GITHUB_GRAPHQL_API, {
  headers: {
    authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});
