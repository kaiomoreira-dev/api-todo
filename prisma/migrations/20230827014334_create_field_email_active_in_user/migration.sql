/*
  Warnings:

  - You are about to drop the column `emailAlert` on the `todos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "todos" DROP COLUMN "emailAlert";

-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "emailActive" BOOLEAN NOT NULL DEFAULT false;
