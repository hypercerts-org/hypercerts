import { PrismaClient } from "@prisma/client";
import { createEventPointersForOrg } from "./createEventPointersForOrg.js";
import { fetchGithubReposForOrg as upsertGithubReposForOrg } from "./upsertGithubReposForOrg.js";

export interface UpsertGithubOrgArgs {
  name: string;
  githubOrg: string;
}

export async function upsertGithubOrg(args: UpsertGithubOrgArgs) {
  const prisma = new PrismaClient();
  let org = await prisma.organization.findFirst({
    where: {
      AND: [
        {
          name: args.name,
        },
        {
          githubOrg: args.githubOrg,
        },
      ],
    },
  });

  if (org) {
    console.log(`Found existing org with id '${org.id}'`);
  } else {
    org = await prisma.organization.create({
      data: {
        name: args.name,
        githubOrg: args.githubOrg,
      },
    });

    console.log(`No existing org found, created a new org with id '${org.id}'`);
  }

  await upsertGithubReposForOrg(org);
  await createEventPointersForOrg(org);
}
