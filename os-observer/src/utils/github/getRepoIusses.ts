import { gql } from "graphql-request";
import { unpaginate } from "./unpaginate.js";

export const query = gql`
  query getRepoIssues($searchString: String!, $cursor: String) {
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
    search(query: $searchString, first: 100, type: ISSUE, after: $cursor) {
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

export function formatGithubDate(date: Date): string {
  const ye = new Intl.DateTimeFormat("en", {
    timeZone: "GMT",
    year: "numeric",
  }).format(date);
  const mo = new Intl.DateTimeFormat("en", {
    timeZone: "GMT",
    month: "2-digit",
  }).format(date);
  const da = new Intl.DateTimeFormat("en", {
    timeZone: "GMT",
    day: "2-digit",
  }).format(date);
  const ho = new Intl.DateTimeFormat("en", {
    timeZone: "GMT",
    hour: "2-digit",
    hour12: false,
  }).format(date);
  const mi = new Intl.DateTimeFormat("en", {
    timeZone: "GMT",
    minute: "2-digit",
  })
    .format(date)
    .padStart(2, "0");
  const se = new Intl.DateTimeFormat("en", {
    timeZone: "GMT",
    second: "2-digit",
  })
    .format(date)
    .padStart(2, "0");

  return `${ye}-${mo}-${da}T${ho}:${mi}:${se}Z`;
}

export async function getRepoIssuesFiled(
  repoNameWithOwner: string,
  startDate: Date,
  currentDate: Date,
): Promise<Issue[]> {
  const startDateStr = formatGithubDate(startDate);
  const currentDateStr = formatGithubDate(currentDate);

  const searchString = `repo:${repoNameWithOwner} is:issue -reason:NOT_PLANNED created:${startDateStr}..${currentDateStr}`;

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

export async function getRepoIssuesClosed(
  repoNameWithOwner: string,
  startDate: Date,
  currentDate: Date,
): Promise<Issue[]> {
  const startDateStr = formatGithubDate(startDate);
  const currentDateStr = formatGithubDate(currentDate);

  const searchString = `repo:${repoNameWithOwner} is:issue -reason:NOT_PLANNED closed:${startDateStr}..${currentDateStr}`;

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
