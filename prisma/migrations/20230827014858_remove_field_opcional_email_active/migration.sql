/*
  Warnings:

  - Made the column `emailActive` on table `tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "emailActive" SET NOT NULL;
