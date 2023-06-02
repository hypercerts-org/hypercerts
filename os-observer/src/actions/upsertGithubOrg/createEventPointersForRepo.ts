import {
  ArtifactNamespace,
  ArtifactType,
  EventType,
  PrismaClient,
  Prisma,
  Artifact,
} from "@prisma/client";
import { getRepositoryCreatedAt } from "./getRepositoryCreatedAt.js";

export function getNameAndOwnerFromUrl(
  githubUrl: string,
): [owner: string, name: string] {
  const prefix = "https://github.com/";

  const [owner, name] = githubUrl.slice(prefix.length).split("/");
  return [owner, name];
}

export async function createEventPointersForRepo(repo: Artifact) {
  const prisma = new PrismaClient();

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

  const [owner, name] = getNameAndOwnerFromUrl(repo.url);

  const repoCreatedAt = await getRepositoryCreatedAt(owner, name);

  const eventSources = await prisma.eventSourcePointer.findMany({
    where: { artifactId: repo.id },
  });
  const githubRepoEvents = [
    EventType.ISSUE_FILED,
    EventType.ISSUE_CLOSED,
    EventType.PULL_REQUEST_CREATED,
    EventType.PULL_REQUEST_MERGED,
    EventType.COMMIT_CODE,
  ];

  const missingEventSources = githubRepoEvents.filter(
    (eventType) =>
      !eventSources.some((eventSource) => eventSource.eventType == eventType),
  );

  const pointer: GithubEventPointer = {
    lastFetch: repoCreatedAt,
  };

  const newEventSources: Prisma.EventSourcePointerCreateManyInput[] =
    missingEventSources.map((eventType) => {
      const queryArgs = {
        artifactId: repo.id,
        eventType: eventType,
      };

      return {
        artifactId: repo.id,
        eventType: eventType,
        pointer: pointer as unknown as Prisma.JsonObject,
        queryCommand: "fetchEvents",
        queryArgs: queryArgs as unknown as Prisma.JsonObject,
      };
    });

  console.log(
    `created ${newEventSources.length} event sources for github repo ${owner}/${name}`,
  );

  await prisma.eventSourcePointer.createMany({
    data: newEventSources,
  });
}

export interface GithubEventPointer {
  lastFetch: string;
}
