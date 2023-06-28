import { PrismaClient } from "@prisma/client";
import { ApiInterface, ApiReturnType, CommonArgs } from "../../../utils/api.js";
import { InvalidInputError } from "../../../utils/error.js";
import { createEventPointersForOrg } from "./createEventPointersForOrg.js";
import { fetchGithubReposForOrg as upsertGithubReposForOrg } from "./upsertGithubReposForOrg.js";

export async function upsertGithubOrg(
  args: UpsertGithubOrgArgs,
): Promise<ApiReturnType> {
  if (!args.orgName) {
    throw new InvalidInputError("Missing required argument: orgName");
  }

  const prisma = new PrismaClient();
  let org = await prisma.organization.findFirst({
    where: {
      AND: [
        {
          name: args.orgName,
        },
        {
          githubOrg: args.orgName,
        },
      ],
    },
  });

  if (org) {
    console.log(`Found existing org with id '${org.id}'`);
  } else {
    org = await prisma.organization.create({
      data: {
        name: args.orgName,
        githubOrg: args.orgName,
      },
    });

    console.log(`No existing org found, created a new org with id '${org.id}'`);
  }

  await upsertGithubReposForOrg(org);
  await createEventPointersForOrg(org);

  return {
    _type: "upToDate",
    cached: true,
  };
}

export type UpsertGithubOrgArgs = Partial<
  CommonArgs & {
    orgName: string;
  }
>;

export const UPSERT_GITHUB_ORG_COMMAND = "upsertGithubOrg";
export const UpsertGithubOrgInterface: ApiInterface<UpsertGithubOrgArgs> = {
  command: UPSERT_GITHUB_ORG_COMMAND,
  func: upsertGithubOrg,
};
