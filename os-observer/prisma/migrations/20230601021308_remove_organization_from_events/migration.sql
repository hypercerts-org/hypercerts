/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `EventSourcePointer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[artifactId,eventType]` on the table `EventSourcePointer` will be added. If there are existing duplicate values, this will fail.
  - Made the column `eventType` on table `EventSourcePointer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "EventSourcePointer" DROP CONSTRAINT "EventSourcePointer_organizationId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "EventSourcePointer" DROP COLUMN "organizationId",
ALTER COLUMN "eventType" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventSourcePointer_artifactId_eventType_key" ON "EventSourcePointer"("artifactId", "eventType");
