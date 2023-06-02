-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('FUNDING', 'PULL_REQUEST_CREATED', 'PULL_REQUEST_MERGED', 'COMMIT_CODE', 'ISSUE_FILED', 'ISSUE_CLOSED', 'DOWNSTREAM_DEPENDENCY_COUNT', 'UPSTREAM_DEPENDENCY_COUNT', 'DOWNLOADS', 'CONTRACT_INVOKED', 'USERS_INTERACTED');

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('EOA_ADDRESS', 'SAFE_ADDRESS', 'CONTRACT_ADDRESS', 'GIT_REPOSITORY', 'NPM_PACKAGE');

-- CreateEnum
CREATE TYPE "ArtifactNamespace" AS ENUM ('ETHEREUM', 'OPTIMISM', 'GOERLI', 'GITHUB', 'GITLAB', 'NPM_REGISTRY');

-- CreateEnum
CREATE TYPE "ContributorNamespace" AS ENUM ('GITHUB_USER');

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "githubOrg" TEXT,
    "description" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" INTEGER,
    "type" "ArtifactType" NOT NULL,
    "namespace" "ArtifactNamespace" NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "details" JSONB,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contributor" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "namespace" "ContributorNamespace" NOT NULL,

    CONSTRAINT "Contributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artifactId" INTEGER NOT NULL,
    "eventType" "EventType" NOT NULL,
    "eventTime" TIMESTAMPTZ(3) NOT NULL,
    "contributorId" INTEGER,
    "amount" DOUBLE PRECISION NOT NULL,
    "details" JSONB,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSourcePointer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artifactId" INTEGER NOT NULL,
    "eventType" "EventType" NOT NULL,
    "queryCommand" TEXT NOT NULL,
    "queryArgs" JSONB NOT NULL,
    "pointer" JSONB NOT NULL,
    "autocrawl" BOOLEAN,

    CONSTRAINT "EventSourcePointer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_githubOrg_key" ON "Organization"("githubOrg");

-- CreateIndex
CREATE UNIQUE INDEX "Artifact_type_namespace_name_key" ON "Artifact"("type", "namespace", "name");

-- CreateIndex
CREATE UNIQUE INDEX "EventSourcePointer_artifactId_eventType_key" ON "EventSourcePointer"("artifactId", "eventType");

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSourcePointer" ADD CONSTRAINT "EventSourcePointer_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
