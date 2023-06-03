import dayjs, { Dayjs } from "dayjs";
import _ from "lodash";
import npmFetch from "npm-registry-fetch";
import {
  ArtifactNamespace,
  ArtifactType,
  EventType,
  getEventSourcePointer,
  insertData,
  prisma,
} from "../db/prisma-client.js";
import {
  EventSourceFunction,
  ApiInterface,
  ApiReturnType,
  CommonArgs,
} from "../utils/api.js";
import {
  assert,
  ensureString,
  ensureArray,
  ensureNumber,
  safeCast,
} from "../utils/common.js";
import { InvalidInputError, MalformedDataError } from "../utils/error.js";
import { logger } from "../utils/logger.js";
import { parseGithubUrl } from "../utils/parsing.js";

// API endpoint to query
const NPM_HOST = "https://api.npmjs.org/";
// npm was initially released 2010-01-12
const DEFAULT_START_DATE = "2010-01-01";
const NPM_DOWNLOADS_COMMAND = "npmDownloads";

// date format used by NPM APIs
export const formatDate = (date: Dayjs) => date.format("YYYY-MM-DD");
// human-readable URL for a package
const getNpmUrl = (name: string) => `https://www.npmjs.com/package/${name}`;

/**
 * What we expect to store in the EventSourcePointer DB table
 */
interface NpmEventSourcePointer {
  lastDate: string;
}

const makeNpmEventSourcePointer = (lastDate: Dayjs): NpmEventSourcePointer => ({
  lastDate: formatDate(lastDate),
});

interface DayDownloads {
  downloads: number;
  day: string;
}

function createDayDownloads(x: any): DayDownloads {
  return {
    downloads: ensureNumber(x.downloads),
    day: ensureString(x.day),
  };
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
  const dateRange = `${formatDate(start)}:${formatDate(end)}`;
  const endpoint = `/downloads/range/${dateRange}/${name}`;
  logger.debug(`Fetching ${endpoint}`);
  const results = await npmFetch
    .json(endpoint, { registry: NPM_HOST })
    .catch((err) => {
      logger.warn("Error fetching from NPM API: ", err);
      return;
    });
  // If we encounter an error, just return an empty array
  if (!results) {
    return [];
  }
  //logger.info(JSON.stringify(fetchResults, null, 2));
  const resultStart = dayjs(ensureString(results.start));
  const resultEnd = dayjs(ensureString(results.end));
  const resultDownloads = ensureArray(results.downloads).map(
    createDayDownloads,
  );
  logger.info(
    `Got ${resultDownloads.length} results from ${formatDate(
      resultStart,
    )} to ${formatDate(resultEnd)}`,
  );

  // If we got all the data, we're good
  if (start.isSame(resultStart, "day") && end.isSame(resultEnd, "day")) {
    return [...resultDownloads];
  } else if (!end.isSame(resultEnd, "day")) {
    // Assume that NPM will always give us the newest data first
    throw new MalformedDataError(
      `Expected end date ${formatDate(end)} but got ${formatDate(resultEnd)}`,
    );
  } else {
    // If we didn't get all the data, recurse
    const missingEnd = resultStart.subtract(1, "day");
    const missingResults = await getDailyDownloads(name, start, missingEnd);
    return [...missingResults, ...resultDownloads];
  }
}

/**
 * Checks to see if the downloads are missing any days between start and end
 * @param downloads
 * @param start
 * @param end
 * @returns
 */
export function getMissingDays(
  downloads: DayDownloads[],
  start: Dayjs,
  end: Dayjs,
): Dayjs[] {
  if (start.isAfter(end, "day")) {
    throw new InvalidInputError(
      `Start date ${formatDate(start)} is after end date ${formatDate(end)}`,
    );
  }

  // According to spec, searches must be sublinear
  const missingDays: Dayjs[] = [];
  const dateSet = new Set(downloads.map((d) => d.day));
  for (
    let datePtr = dayjs(start);
    datePtr.isBefore(end, "day") || datePtr.isSame(end, "day");
    datePtr = datePtr.add(1, "day")
  ) {
    if (!dateSet.has(formatDate(datePtr))) {
      missingDays.push(datePtr);
    }
  }
  return missingDays;
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
export type NpmDownloadsArgs = CommonArgs & {
  name: string;
};

/**
 * Get all of the daily downloads for a package
 * @param args
 */
export const npmDownloads: EventSourceFunction<NpmDownloadsArgs> = async (
  args: NpmDownloadsArgs,
): Promise<ApiReturnType> => {
  const { name, autocrawl } = args;
  logger.info(`NPM Downloads: fetching for ${name}`);

  // Add the organization and artifact into the database
  const dbArtifact = await getArtifactOrganization(name);

  // Get the latest event source pointer
  logger.debug("Getting latest event source pointer");
  const previousPointer = await getEventSourcePointer<NpmEventSourcePointer>(
    dbArtifact.id,
    EventType.DOWNLOADS,
  );
  logger.info("EventSourcePointer: ", previousPointer);

  // Start 1 day after the last date we have
  const start = dayjs(previousPointer.lastDate ?? DEFAULT_START_DATE).add(
    1,
    "day",
  );
  // Today's counts may not yet be complete
  const end = dayjs().subtract(1, "day");

  // Short circuit if we're already up to date
  if (end.isBefore(start, "day")) {
    return {
      _type: "upToDate",
      cached: true,
    };
  }

  // Retrieve any missing data
  const downloads: DayDownloads[] = await getDailyDownloads(name, start, end);

  // Check for correctness of data
  assert(!hasDuplicates(downloads), "Duplicate dates found in result");
  // If this is the first time running this query, just check that we have the last day
  const missingDays = !previousPointer.lastDate
    ? getMissingDays(downloads, end, end)
    : getMissingDays(downloads, start, end);
  assert(
    missingDays.length === 0,
    `Missing dates found in result: ${missingDays.map(formatDate).join(", ")}`,
  );

  // Transform the data into the format we want to store
  const dbEntries = downloads.map((d) => ({
    artifactId: dbArtifact.id,
    eventType: EventType.DOWNLOADS,
    eventTime: dayjs(d.day).toDate(),
    amount: d.downloads,
  }));

  // Populate the database
  await insertData(
    dbArtifact.id,
    EventType.DOWNLOADS,
    dbEntries,
    previousPointer,
    safeCast<Partial<NpmEventSourcePointer>>(makeNpmEventSourcePointer(end)),
    NPM_DOWNLOADS_COMMAND,
    safeCast<Partial<NpmDownloadsArgs>>(args),
    autocrawl,
  );

  // Return results
  return {
    _type: "success",
    count: downloads.length,
  };
};

export const NpmDownloadsInterface: ApiInterface<NpmDownloadsArgs> = {
  command: NPM_DOWNLOADS_COMMAND,
  func: npmDownloads,
};
