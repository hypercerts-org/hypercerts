import { gql, request } from "graphql-request";
import { PrismaClient, EventType } from "@prisma/client";

export const query = gql`
  {
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
    search(
      query: "org:gitcoinco is:issue -reason:NOT_PLANNED"
      first: 100
      type: ISSUE
    ) {
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
          repository {
            name
          }
          url
          state
          stateReason
        }
      }
    }
  }
`;

// startDate == since
// endDate == until
export const variables = {
  first: 100,
  after: "null",
  org: "truffle-box",
};

// from python:
// test = execute_org_query(0, "truffle-box", "2022-01-01T00:00:00Z", "2023-04-22T00:00:00Z")

// Date strings are first run through this function
// date_fmt = "%Y-%m-%dT%H:%M:%SZ"
// def to_date(date):
// return date.strftime(date_fmt)

const prisma = new PrismaClient();

async function getPointerForEventType<T extends EventType>(
  event_type: EventType,
): Promise<EventTypePointerLookup[T] | null> {
  const pointer = await prisma.caching_pointer.findFirst({
    where: { event_enum: { equals: event_type } },
  });

  if (!pointer) {
    // TODO: error handling
    return null;
  }

  return pointer.pointer as any;
}

interface EventTypePointerLookup {
  [EventType.GITHUB_CREATED_PR]: GithubCreatedPrPointer;
}

interface GithubCreatedPrPointer {
  lastFetch: string;
}

export async function main() {
  const pointer = await getPointerForEventType(EventType.GITHUB_CREATED_PR);
  console.log(pointer);
}

export function fetchGithubRepo() {
  return "Hello World";
}

export interface GithubOrg {
  type: "githubOrg";
  name: string;
}

export interface GithubRepo {
  type: "githubRepo";
  name: string;
  owner: string;
}

function fetchGithub(orgOrRepo: GithubOrg | GithubRepo) {
  switch (orgOrRepo.type) {
    case "githubOrg":
  }
}

//main();
