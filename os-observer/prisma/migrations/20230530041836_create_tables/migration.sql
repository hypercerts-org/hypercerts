-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('FUNDING', 'PULL_REQUEST_CREATED', 'PULL_REQUEST_MERGED', 'COMMIT_CODE', 'ISSUE_FILED', 'ISSUE_CLOSED', 'DOWNSTREAM_DEPENDENCY_COUNT', 'UPSTREAM_DEPENDENCY_COUNT', 'DOWNLOADS', 'CONTRACT_INVOKED', 'USERS_INTERACTED');

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('EOA_ADDRESS', 'SAFE_ADDRESS', 'CONTRACT_ADDRESS', 'GIT_REPOSITORY', 'NPM_PACKAGE');

-- CreateEnum
CREATE TYPE "ArtifactNamespace" AS ENUM ('ETHEREUM', 'OPTIMISM', 'GOERLI', 'GITHUB', 'NPM');

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "githubOrg" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "type" "ArtifactType" NOT NULL,
    "namespace" "ArtifactNamespace" NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "details" JSONB,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "artifactId" INTEGER NOT NULL,
    "eventType" "EventType",
    "eventTime" TIMESTAMPTZ(3),
    "contributor" TEXT,
    "amount" DOUBLE PRECISION,
    "details" JSONB,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSourcePointer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "artifactId" INTEGER NOT NULL,
    "eventType" "EventType",
    "pointer" JSONB NOT NULL,

    CONSTRAINT "EventSourcePointer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSourcePointer" ADD CONSTRAINT "EventSourcePointer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSourcePointer" ADD CONSTRAINT "EventSourcePointer_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
