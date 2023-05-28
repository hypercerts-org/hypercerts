import { PrismaClient, EventType } from "@prisma/client";
const prisma = new PrismaClient();

async function getPointerForEventType<T extends EventType>(
  event_type: EventType,
): Promise<EventTypePointerLookup[T] | null> {
  const pointer = await prisma.caching_pointer.findFirst({
    where: { event_enum: { equals: event_type } },
  });

  if (!pointer) {
    // TODO: error handling
    return null;
  }

  return pointer.pointer as any;
}

interface EventTypePointerLookup {
  [EventType.GITHUB_CREATED_PR]: GithubCreatedPrPointer;
}

interface GithubCreatedPrPointer {
  lastFetch: string;
}

async function main() {
  const pointer = await getPointerForEventType(EventType.GITHUB_CREATED_PR);
  console.log(pointer);
}

main();
