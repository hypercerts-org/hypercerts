/*
  Warnings:

  - A unique constraint covering the columns `[type,namespace,name]` on the table `Artifact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Artifact_type_namespace_name_key" ON "Artifact"("type", "namespace", "name");
