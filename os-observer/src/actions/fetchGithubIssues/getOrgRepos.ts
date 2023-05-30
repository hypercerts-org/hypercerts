import { gql } from "graphql-request";
import { unpaginate } from "./unpaginate.js";

const query = gql`
  query getOrgRepos($name: String!, $cursor: String) {
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
    organization(login: $name) {
      id
      createdAt
      repositories(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            nameWithOwner
          }
        }
      }
    }
  }
`;

interface Data {
  rateLimit: {
    limit: number;
    cost: number;
    remaining: number;
    resetAt: string;
  };
  organization: {
    id: string;
    createdAt: string;
    repositories: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
      edges: [
        {
          node: {
            nameWithOwner: string;
          };
        },
      ];
    };
  };
}

export async function getOrgRepos(orgName: string): Promise<string[]> {
  const variables = {
    name: orgName,
  };

  const nodes = await unpaginate<Data>()(
    query,
    "organization.repositories.edges",
    "organization.repositories.pageInfo",
    variables,
  );

  return nodes.map((node) => node.node.nameWithOwner);
}
