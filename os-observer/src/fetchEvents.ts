import {
  Artifact,
  ArtifactNamespace,
  ArtifactType,
  EventType,
  PrismaClient,
  EventSourcePointer,
} from "@prisma/client";
import { fetchGithubIssues } from "./actions/fetchGithubIssues/index.js";

export interface FetchEventsArgs {
  artifactId: number;
  eventType: string;
}

function isEventType(str: string): str is EventType {
  return str in EventType;
}

export async function fetchEvents(args: FetchEventsArgs) {
  const prisma = new PrismaClient();

  const artifact = await prisma.artifact.findUnique({
    where: { id: args.artifactId },
  });
  if (!artifact) {
    throw new Error(`Failed to find artifact for id ${args.artifactId}`);
  }

  if (!isEventType(args.eventType)) {
    throw new Error(`Unknown eventType ${args.eventType}`);
  }
  const eventType = EventType[args.eventType];

  // [artifactId, eventType] tuples are enforced as unique in the DB, but the prisma client does not understand this so we can't use findUnique
  const pointer = await prisma.eventSourcePointer.findFirst({
    where: {
      AND: [
        {
          artifactId: artifact.id,
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

  const fetcher = findFetcher(artifact, args.eventType);
  if (!fetcher) {
    throw new Error(
      `No matching fetcher found for artifact+event. artifactNamespace: ${artifact.namespace}, artifactType: ${artifact.type}, eventType: ${args.eventType}`,
    );
  }

  fetcher(artifact, pointer);
}

function findFetcher(
  artifact: Artifact,
  eventType: string,
): FetcherFunc | null {
  for (const eventFetcher of EVENT_FETCHERS) {
    if (
      eventFetcher.key.artifactNamespace == artifact.namespace &&
      eventFetcher.key.artifactType == artifact.type &&
      eventFetcher.key.eventType == eventType
    ) {
      return eventFetcher.fetcher;
    }
  }

  return null;
}

type FetcherFunc = (
  artifact: Artifact,
  pointer: EventSourcePointer,
) => Promise<void>;

interface EventFetcherKey {
  artifactNamespace: ArtifactNamespace;
  artifactType: ArtifactType;
  eventType: EventType;
}

interface EventFetcher {
  key: EventFetcherKey;
  fetcher: FetcherFunc;
}

const EVENT_FETCHERS: EventFetcher[] = [
  {
    key: {
      artifactNamespace: ArtifactNamespace.GITHUB,
      artifactType: ArtifactType.GIT_REPOSITORY,
      eventType: EventType.ISSUE_FILED,
    },
    fetcher: fetchGithubIssues,
  },
];
