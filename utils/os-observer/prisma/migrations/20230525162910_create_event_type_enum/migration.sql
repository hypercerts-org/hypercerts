-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('GITHUB_CREATED_PR');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "event_enum" "EventType";

-- CreateTable
CREATE TABLE "caching_pointer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_enum" "EventType" NOT NULL,
    "pointer" JSONB NOT NULL,

    CONSTRAINT "caching_pointer_pkey" PRIMARY KEY ("id")
);
