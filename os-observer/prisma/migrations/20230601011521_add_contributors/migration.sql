/*
  Warnings:

  - The values [NPM] on the enum `ArtifactNamespace` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `contributor` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[githubOrg]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contributorId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ArtifactNamespace_new" AS ENUM ('ETHEREUM', 'OPTIMISM', 'GOERLI', 'GITHUB', 'GITLAB', 'NPM_REGISTRY');
ALTER TABLE "Artifact" ALTER COLUMN "namespace" TYPE "ArtifactNamespace_new" USING ("namespace"::text::"ArtifactNamespace_new");
ALTER TYPE "ArtifactNamespace" RENAME TO "ArtifactNamespace_old";
ALTER TYPE "ArtifactNamespace_new" RENAME TO "ArtifactNamespace";
DROP TYPE "ArtifactNamespace_old";
COMMIT;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "contributor",
ADD COLUMN     "contributorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "githubOrg" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Contributor" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Contributor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_githubOrg_key" ON "Organization"("githubOrg");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
