import npmFetch from "npm-registry-fetch";
import { EventSourceFunction, ApiReturnType } from "../utils/api.js";
import { logger } from "../utils/logger.js";
import { parseGithubUrl } from "../utils/parsing.js";
import {
  prisma,
  ArtifactNamespace,
  ArtifactType,
  EventType,
} from "../db/prisma-client.js";

export const getNpmUrl = (name: string) =>
  `https://www.npmjs.com/package/${name}`;

export interface EventSourcePointer {
  lastDate: string;
}

export interface NpmDownloadsArgs {
  name: string;
}

/**
 * Get all of the daily downloads for a package
 * TODO: refactor out the idempotent parts of this into utility functions
 * @param args
 */
export const npmDownloads: EventSourceFunction<NpmDownloadsArgs> = async (
  args: NpmDownloadsArgs,
): Promise<ApiReturnType> => {
  const { name } = args;
  logger.info(`NPM Downloads: fetching for ${name}`);

  // Get package.json
  const pkgManifest: any = await npmFetch.json(`/${name}/latest`);
  //console.log(JSON.stringify(pkgManifest, null, 2));

  // Check if the organization exists
  const repoUrl = pkgManifest?.repository?.url ?? "";
  const { owner: githubOrg } = parseGithubUrl(repoUrl) ?? {};
  if (!githubOrg) {
    logger.warn(`Unable to find the GitHub organization for ${name}`);
  } else {
    logger.debug(`GitHub organization for ${name}: ${githubOrg}`);
  }

  // Upsert the organization and artifact into the database
  const dbOrg = githubOrg
    ? await prisma.organization.upsert({
        where: {
          githubOrg,
        },
        update: {},
        create: {
          name: githubOrg,
          githubOrg,
        },
      })
    : null;
  const dbArtifact = await prisma.artifact.upsert({
    where: {
      type_namespace_name: {
        type: ArtifactType.NPM_PACKAGE,
        namespace: ArtifactNamespace.NPM_REGISTRY,
        name: name,
      },
    },
    update: {},
    create: {
      organizationId: dbOrg?.id,
      type: ArtifactType.NPM_PACKAGE,
      namespace: ArtifactNamespace.NPM_REGISTRY,
      name: name,
      url: getNpmUrl(name),
    },
  });
  logger.info("Inserted organization into database", dbOrg);
  logger.info("Inserted artifact into database", dbArtifact);

  // Get the latest event source pointer

  // Retrieve any missing data

  // Populate the database

  const dbEventSourcePointer = await prisma.eventSourcePointer.upsert({
    where: {
      artifactId_eventType: {
        artifactId: dbArtifact.id,
        eventType: EventType.DOWNLOADS,
      },
    },
    update: {},
    create: {
      artifactId: dbArtifact.id,
      eventType: EventType.DOWNLOADS,
      pointer: {},
    },
  });

  // Return results

  return {
    _type: "upToDate",
    cached: true,
  };
};
