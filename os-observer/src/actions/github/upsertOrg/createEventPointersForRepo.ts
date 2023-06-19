import {
  ArtifactNamespace,
  ArtifactType,
  PrismaClient,
  Prisma,
  Artifact,
} from "@prisma/client";
import { getRepositoryCreatedAt } from "../../../utils/github/getRepositoryCreatedAt.js";
import { GithubIssueClosedInterface } from "../fetch/issueClosed.js";
import { GithubIssueFiledInterface } from "../fetch/issueFiled.js";

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
    GithubIssueFiledInterface,
    GithubIssueClosedInterface,
  ];

  const missingEventSources = githubRepoEvents.filter(
    (eventInterface) =>
      !eventSources.some(
        (eventSource) => eventSource.eventType == eventInterface.eventType,
      ),
  );

  const pointer: GithubEventPointer = {
    lastFetch: repoCreatedAt,
  };

  const newEventSources: Prisma.EventSourcePointerCreateManyInput[] =
    missingEventSources.map((eventInterface) => {
      const queryArgs = {
        org: owner,
        repo: repo.name,
      };

      return {
        artifactId: repo.id,
        eventType: eventInterface.eventType,
        pointer: pointer as unknown as Prisma.JsonObject,
        queryCommand: eventInterface.command,
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
