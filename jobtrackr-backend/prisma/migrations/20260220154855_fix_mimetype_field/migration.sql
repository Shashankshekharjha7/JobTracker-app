/*
  Warnings:

  - You are about to drop the column `mimetype` on the `Resume` table. All the data in the column will be lost.
  - Added the required column `mimeType` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "mimetype",
ADD COLUMN     "mimeType" TEXT NOT NULL;
