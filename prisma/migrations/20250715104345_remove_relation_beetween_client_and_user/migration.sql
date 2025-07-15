/*
  Warnings:

  - You are about to drop the column `userId` on the `Client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- DropIndex
DROP INDEX "Client_userId_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "userId";
