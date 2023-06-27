import {
  PrismaClient,
  Prisma,
  ArtifactType,
  ArtifactNamespace,
  Organization,
} from "@prisma/client";

import { getOrgRepos } from "../../../utils/github/getOrgRepos.js";

export async function fetchGithubReposForOrg(org: Organization) {
  const prisma = new PrismaClient();

  if (!org.githubOrg) {
    throw new Error(
      `Org has no githubOrg string so cannot be used as a Github Org. org.id: ${org.id}`,
    );
  }

  const existingArtifacts = await prisma.artifact.findMany({
    where: {
      organizationId: org.id,
    },
  });

  const repos = await getOrgRepos(org.githubOrg);
  const newRepos = repos.filter(
    (repo) =>
      !existingArtifacts.some(
        (artifact) => artifact.url && artifact.url == repo.url,
      ),
  );

  const newArtifacts: Prisma.ArtifactCreateManyInput[] = newRepos.map(
    (repo) => {
      return {
        organizationId: org.id,
        type: ArtifactType.GIT_REPOSITORY,
        namespace: ArtifactNamespace.GITHUB,
        name: repo.name,
        url: repo.url,
      };
    },
  );

  await prisma.artifact.createMany({
    data: newArtifacts,
  });

  console.log(
    `Created ${newRepos.length} new github repository artifacts for ${org.name}`,
  );
}

// NOTE: github org names might not be case sensitive
