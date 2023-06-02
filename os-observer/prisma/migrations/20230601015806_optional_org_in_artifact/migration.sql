-- DropForeignKey
ALTER TABLE "Artifact" DROP CONSTRAINT "Artifact_organizationId_fkey";

-- AlterTable
ALTER TABLE "Artifact" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
