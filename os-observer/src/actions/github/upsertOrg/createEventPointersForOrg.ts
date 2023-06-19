import {
  ArtifactNamespace,
  ArtifactType,
  Organization,
  PrismaClient,
} from "@prisma/client";
import { createEventPointersForRepo } from "./createEventPointersForRepo.js";

export async function createEventPointersForOrg(org: Organization) {
  const prisma = new PrismaClient();

  const orgRepos = await prisma.artifact.findMany({
    where: {
      AND: [
        {
          organizationId: org.id,
        },
        {
          type: ArtifactType.GIT_REPOSITORY,
        },
        {
          namespace: ArtifactNamespace.GITHUB,
        },
      ],
    },
  });

  for (const orgRepo of orgRepos) {
    await createEventPointersForRepo(orgRepo);
  }
}
