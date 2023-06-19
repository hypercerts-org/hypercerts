import {
  EventSourceFunction,
  ApiInterface,
  ApiReturnType,
  CommonArgs,
} from "../../../utils/api.js";

import { EventType, Prisma } from "@prisma/client";
import { insertData } from "../../../db/prisma-client.js";
import { GithubEventPointer } from "../upsertOrg/createEventPointersForRepo.js";
import {
  formatGithubDate,
  getRepoIssuesClosed,
} from "../../../utils/github/getRepoIusses.js";
import { getGithubPointer } from "../../../utils/github/getGithubPointer.js";

export interface GithubApiInterface extends ApiInterface<GithubFetchArgs> {
  eventType: EventType;
}

const githubIssueClosed: EventSourceFunction<GithubFetchArgs> = async (
  args: GithubFetchArgs,
): Promise<ApiReturnType> => {
  const [dbArtifact, pointer] = await getGithubPointer(
    args,
    EventType.ISSUE_CLOSED,
  );

  const startDate = new Date(Date.parse(pointer.lastFetch));

  const currentDate = new Date();

  const issues = await getRepoIssuesClosed(
    `${args.org}/${args.repo}`,
    startDate,
    currentDate,
  );

  const dbIssues: Prisma.EventCreateManyInput[] = issues.map((issue) => {
    return {
      artifactId: dbArtifact.id,
      eventTime: issue.closedAt as any,
      eventType: EventType.ISSUE_CLOSED,
      amount: 0,
      details: {
        url: issue.url,
        login: issue.author.login,
      },
      contributorId: 2,
    };
  });

  const newPointerData: GithubEventPointer = {
    lastFetch: formatGithubDate(currentDate),
  };

  // Populate the database
  await insertData(
    dbArtifact.id,
    EventType.ISSUE_CLOSED,
    dbIssues,
    pointer as any,
    newPointerData as any,
    GITHUB_ISSUE_CLOSED_COMMAND,
    args,
    true,
  );

  return {
    _type: "upToDate",
    cached: true,
  };
};

export type GithubFetchArgs = Partial<
  CommonArgs & {
    org: string;
    repo: string;
  }
>;

export const GITHUB_ISSUE_CLOSED_COMMAND = "githubIssueClosed";
export const GithubIssueClosedInterface: GithubApiInterface = {
  command: GITHUB_ISSUE_CLOSED_COMMAND,
  func: githubIssueClosed,
  eventType: EventType.ISSUE_CLOSED,
};
