import {
  PrismaClient,
  ArtifactNamespace,
  ArtifactType,
  EventType,
} from "@prisma/client";

export const prisma = new PrismaClient();
export { ArtifactNamespace, ArtifactType, EventType };
