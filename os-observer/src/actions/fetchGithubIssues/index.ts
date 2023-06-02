import {
  Artifact,
  ArtifactNamespace,
  ArtifactType,
  EventSourcePointer,
  EventType,
  Prisma,
} from "@prisma/client";
import { prisma } from "../../db/prisma-client.js";
import {
  getNameAndOwnerFromUrl,
  GithubEventPointer,
} from "../upsertGithubOrg/createEventPointersForRepo.js";
import { formatGithubDate, getRepoIssues } from "./getRepoIusses.js";

export async function fetchGithubIssues(
  repo: Artifact,
  pointer: EventSourcePointer,
) {
  if (
    repo.type != ArtifactType.GIT_REPOSITORY ||
    repo.namespace != ArtifactNamespace.GITHUB
  ) {
    throw new Error(
      `Artifact is is not a repository on github. id: ${repo.id}, type: ${repo.type}, namespace: ${repo.namespace}`,
    );
  }

  if (!repo.url) {
    throw new Error(`Github repository artifact has no URL. id: ${repo.id}`);
  }

  if (
    pointer.eventType != EventType.ISSUE_FILED &&
    pointer.eventType != EventType.ISSUE_CLOSED
  ) {
    throw new Error(
      `Wrong eventEvent type for pointer, expected ISSUE_FILED or ISSUE_CLOSED found ${pointer.eventType}`,
    );
  }

  if (pointer.artifactId != repo.id) {
    throw new Error(
      `artifact.id does not match pointer.artifactId. artifact.id: ${repo.id}, pointer.artifactId: ${pointer.artifactId}`,
    );
  }

  if (!pointer.pointer) {
    throw new Error(`Pointer data is falsy`);
  }

  const pointerData: GithubEventPointer = pointer.pointer as any;
  const startDate = new Date(Date.parse(pointerData.lastFetch));

  const [owner, name] = getNameAndOwnerFromUrl(repo.url);

  const currentDate = new Date();

  const issues = await getRepoIssues(
    `${owner}/${name}`,
    startDate,
    currentDate,
  );

  const newIssues: Prisma.EventCreateManyInput[] = issues.map((issue) => {
    return {
      artifactId: repo.id,
      eventTime: issue.createdAt,
      eventType: EventType.ISSUE_FILED,
      amount: 0,
      details: {
        url: issue.url,
        login: issue.author.login,
      },
      contributorId: 2,
    };
  });

  await prisma.$transaction([
    prisma.event.createMany({ data: newIssues }),
    prisma.eventSourcePointer.update({
      where: {
        id: pointer.id,
      },
      data: {
        pointer: {
          lastFetch: formatGithubDate(currentDate),
        },
      },
    }),
  ]);

  console.log(
    `Added ${newIssues.length} ISSUE_FILED events for ${owner}/${name}`,
  );
}
