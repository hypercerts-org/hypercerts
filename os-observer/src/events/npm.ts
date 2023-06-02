import dayjs, { Dayjs } from "dayjs";
import _ from "lodash";
import npmFetch from "npm-registry-fetch";
import { EventSourceFunction, ApiReturnType } from "../utils/api.js";
import { safeCast } from "../utils/common.js";
import { logger } from "../utils/logger.js";
import { parseGithubUrl } from "../utils/parsing.js";
import {
  prisma,
  ArtifactNamespace,
  ArtifactType,
  EventType,
} from "../db/prisma-client.js";
import { InvalidInputError } from "../utils/error.js";
import { assert } from "../utils/common.js";

// API endpoint to query
const NPM_HOST = "https://api.npmjs.org/";
// npm was initially released 2010-01-12
const DEFAULT_START_DATE = "2010-01-01";

// date format used by NPM APIs
const formatDate = (date: Dayjs) => date.format("YYYY-MM-DD");
// human-readable URL for a package
export const getNpmUrl = (name: string) =>
  `https://www.npmjs.com/package/${name}`;

/**
 * What we expect to store in the EventSourcePointer DB table
 */
interface EventSourcePointer {
  lastDate: string;
}

interface DayDownloads {
  downloads: number;
  day: string;
}

/**
 * Get the artifact and organization for a package, creating it if it doesn't exist
 *
 * @param name npm package name
 * @returns Artifact
 */
async function getArtifactOrganization(name: string) {
  // Get package.json
  logger.debug(`Fetching package.json`);
  const pkgManifest: any = await npmFetch.json(`/${name}/latest`);
  //console.log(JSON.stringify(pkgManifest, null, 2));

  // Check if the organization exists
  const repoUrl = pkgManifest?.repository?.url ?? "";
  logger.info(`Repository URL: ${repoUrl}`);
  const { owner: githubOrg } = parseGithubUrl(repoUrl) ?? {};
  if (!githubOrg) {
    logger.warn(`Unable to find the GitHub organization for ${name}`);
  } else {
    logger.info(`GitHub organization for ${name}: ${githubOrg}`);
  }

  // Upsert the organization and artifact into the database
  logger.debug("Upserting organization and artifact into database");
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
  logger.info("Inserted organization into DB", dbOrg);
  logger.info("Inserted artifact into DB", dbArtifact);

  return dbArtifact;
}

/**
 * When you query the NPM API with a range, it may only return a subset of dates you want
 * This function lets us recurse until we get everything
 * @param name npm package name
 * @param start date inclusive
 * @param end date inclusive
 */
async function getDailyDownloads(
  name: string,
  start: Dayjs,
  end: Dayjs,
): Promise<DayDownloads[]> {
  const results: DayDownloads[] = [];
  const dateRange = `${formatDate(start)}:${formatDate(end)}`;
  const endpoint = `/downloads/range/${dateRange}/${name}`;
  logger.debug(`Fetching ${endpoint}`);
  const result = await npmFetch.json(endpoint, { registry: NPM_HOST });
  logger.info(JSON.stringify(result, null, 2));

  return results;
}

/**
 * Checks to see if the downloads are missing any days between start and end
 * @param downloads
 * @param start
 * @param end
 * @returns
 */
export function hasMissingDays(
  downloads: DayDownloads[],
  start: Dayjs,
  end: Dayjs,
): boolean {
  if (start.isAfter(end)) {
    throw new InvalidInputError(
      `Start date ${formatDate(start)} is after end date ${formatDate(end)}`,
    );
  }

  // According to spec, searches must be sublinear
  const dateSet = new Set(downloads.map((d) => d.day));
  for (
    let datePtr = dayjs(start);
    datePtr.isBefore(end) || datePtr.isSame(end);
    datePtr = datePtr.add(1, "day")
  ) {
    if (!dateSet.has(formatDate(datePtr))) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether there are any duplicate days in the downloads
 * @param downloads
 */
export function hasDuplicates(downloads: DayDownloads[]): boolean {
  const dates = downloads.map((d) => d.day);
  const deduplicated = _.uniq(dates);
  return dates.length !== deduplicated.length;
}

/**
 * Entrypoint arguments
 */
export interface NpmDownloadsArgs {
  name: string;
}

/**
 * Get all of the daily downloads for a package
 * @param args
 */
export const npmDownloads: EventSourceFunction<NpmDownloadsArgs> = async (
  args: NpmDownloadsArgs,
): Promise<ApiReturnType> => {
  const { name } = args;
  logger.info(`NPM Downloads: fetching for ${name}`);

  // Add the organization and artifact into the database
  const dbArtifact = await getArtifactOrganization(name);

  // Get the latest event source pointer
  logger.debug("Getting latest event source pointer");
  const dbEventSourcePointer = await prisma.eventSourcePointer.findUnique({
    where: {
      artifactId_eventType: {
        artifactId: dbArtifact.id,
        eventType: EventType.DOWNLOADS,
      },
    },
  });
  logger.info("EventSourcePointer: ", dbEventSourcePointer);
  const { lastDate } = safeCast(
    _.toPlainObject(
      dbEventSourcePointer?.pointer,
    ) as Partial<EventSourcePointer>,
  );

  // Retrieve any missing data
  // Start 1 day after the last date we have
  const start = dayjs(lastDate ?? DEFAULT_START_DATE).add(1, "day");
  // Today's counts may not yet be complete
  const end = dayjs().subtract(1, "day");
  const downloads: DayDownloads[] = await getDailyDownloads(name, start, end);

  // Check for correctness of data
  assert(!hasDuplicates(downloads), "Duplicate dates found in result");
  assert(
    !hasMissingDays(downloads, start, end),
    "Missing dates found in result",
  );

  // Transform the data into the format we want to store

  // Populate the database

  /**
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
  */
  // Return results

  return {
    _type: "upToDate",
    cached: true,
  };
};
