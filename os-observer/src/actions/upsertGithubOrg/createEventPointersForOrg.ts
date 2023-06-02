import { Organization, PrismaClient } from "@prisma/client";
import { createEventPointersForRepo } from "./createEventPointersForRepo.js";

export async function createEventPointersForOrg(org: Organization) {
  const prisma = new PrismaClient();

  const orgRepos = await prisma.artifact.findMany({
    where: {
      organizationId: org.id,
    },
  });

  for (const orgRepo of orgRepos) {
    await createEventPointersForRepo(orgRepo);
  }
}
