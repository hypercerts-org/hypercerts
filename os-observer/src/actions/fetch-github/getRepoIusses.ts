import { gql } from "graphql-request";
import { unpaginate } from "./unpaginate.js";

export const query = gql`
  query getRepoIssues($searchString: String!) {
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
    search(query: $searchString, first: 100, type: ISSUE) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on Issue {
          createdAt
          closedAt
          author {
            login
          }
          title
          url
          state
          stateReason
        }
      }
    }
  }
`;

interface Data {
  search: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: Issue[];
  };
}

interface Issue {
  createdAt: string;
  closedAt: string | null;
  author: {
    login: string;
  };
  title: string;
  url: string;
  state: string;
  stateReason: string | null;
}

export async function getRepoIssues(
  repoNameWithOwner: string,
): Promise<Issue[]> {
  const searchString = `repo:${repoNameWithOwner} is:issue -reason:NOT_PLANNED`;

  const variables = {
    searchString,
  };

  const issues = await unpaginate<Data>()(
    query,
    "search.nodes",
    "search.pageInfo",
    variables,
  );

  return issues;
}
