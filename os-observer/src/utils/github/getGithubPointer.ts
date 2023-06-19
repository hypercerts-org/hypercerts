import { Artifact, Organization } from "@prisma/client";
import { GithubFetchArgs } from "../../actions/github/fetch/issueFiled.js";
import { GithubEventPointer } from "../../actions/github/upsertOrg/createEventPointersForRepo.js";
import { EventType, prisma } from "../../db/prisma-client.js";
import { InvalidInputError } from "../error.js";
import { logger } from "../logger.js";

export async function getGithubPointer(
  args: GithubFetchArgs,
  eventType: EventType,
): Promise<[Organization, Artifact, GithubEventPointer]> {
  const { org, repo } = args;

  if (!org) {
    throw new InvalidInputError("Missing required argument: org");
  }

  if (!repo) {
    throw new InvalidInputError("Missing required argument: org");
  }

  const dbOrg = await prisma.organization.findFirst({
    where: { name: args.org },
  });

  if (!dbOrg) {
    throw new InvalidInputError(`No org matching ${args.org}`);
  }

  const dbArtifact = await prisma.artifact.findFirst({
    where: {
      AND: [
        {
          name: args.repo,
          organizationId: dbOrg.id,
        },
      ],
    },
  });

  if (!dbArtifact) {
    throw new InvalidInputError(
      `No artifact matching ${args.org} and ${args.repo}`,
    );
  }

  const pointer = await prisma.eventSourcePointer.findFirst({
    where: {
      AND: [
        {
          artifactId: dbArtifact.id,
        },
        {
          eventType: eventType,
        },
      ],
    },
  });

  if (!pointer) {
    throw new Error(`No pointer found for artifact and event type`);
  }

  return [dbOrg, dbArtifact, pointer.pointer as any];
}
