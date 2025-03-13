/*
  Warnings:

  - Made the column `examCode` on table `Exam` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Exam" ALTER COLUMN "examCode" SET NOT NULL;
