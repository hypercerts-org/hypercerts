import _ from "lodash";
import {
  PrismaClient,
  ArtifactNamespace,
  ArtifactType,
  EventType,
  Prisma,
} from "@prisma/client";
import { assert, normalizeToObject } from "../utils/common.js";

export const prisma = new PrismaClient();
export { ArtifactNamespace, ArtifactType, EventType };

/**
 * Before you do any work to fetch data, use this to retrieve the EventSourcePointer
 * from the database.
 * - You'll only fetch data from this point forward
 * - You'll need this to insert data below
 * @param artifactId
 * @param eventType
 * @returns
 */
export async function getEventSourcePointer<PointerType>(
  artifactId: number,
  eventType: EventType,
) {
  const record = await prisma.eventSourcePointer.findUnique({
    where: {
      artifactId_eventType: {
        artifactId,
        eventType,
      },
    },
  });
  // Safe because `Partial` means they're all optional props anyway
  return normalizeToObject<PointerType>(record?.pointer);
}

/**
 * Idempotent insertions, which will
 * - Check that the EventSourcePointer hasn't changed
 * - Insert the data
 * - Update the EventSourcePointer
 *
 * @param previousPointer
 * @param artifactId
 * @param events
 * @param autocrawl
 * @returns
 */
export async function insertData<PointerType>(
  artifactId: number,
  eventType: EventType,
  events: Prisma.EventCreateManyInput[],
  previousPointer: Prisma.JsonObject,
  newPointer: Prisma.JsonObject,
  queryCommand: string,
  queryArgs: Prisma.JsonObject,
  autocrawl?: boolean,
) {
  // Set it all up as an atomic transaction
  return await prisma.$transaction(async (txn) => {
    // Check if the pointer hasn't changed, abort if so (concurrent job)
    const dbCheckEvtSrcPtr = await txn.eventSourcePointer.findUnique({
      where: {
        artifactId_eventType: {
          artifactId,
          eventType,
        },
      },
    });

    // Make sure that the pointer hasn't changed
    assert(
      _.isEqual(
        normalizeToObject<PointerType>(dbCheckEvtSrcPtr?.pointer),
        previousPointer,
      ),
      `EventSourcePointer has changed. Aborting. Expected$ ${JSON.stringify(
        previousPointer,
      )}, Saw ${JSON.stringify(dbCheckEvtSrcPtr?.pointer)}`,
    );

    // Insert the data
    await txn.event.createMany({
      data: events,
      skipDuplicates: true,
    });

    // Update the event source pointer
    await txn.eventSourcePointer.upsert({
      where: {
        artifactId_eventType: {
          artifactId,
          eventType,
        },
      },
      update: {
        queryCommand,
        queryArgs,
        pointer: newPointer,
        ...(autocrawl ? { autocrawl } : {}),
      },
      create: {
        artifactId,
        eventType,
        queryCommand,
        queryArgs,
        pointer: newPointer,
        ...(autocrawl ? { autocrawl } : {}),
      },
    });
  });
}
