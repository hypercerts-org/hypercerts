/*
  Warnings:

  - Added the required column `queryArgs` to the `EventSourcePointer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queryCommand` to the `EventSourcePointer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventSourcePointer" ADD COLUMN     "queryArgs" JSONB NOT NULL,
ADD COLUMN     "queryCommand" TEXT NOT NULL;
