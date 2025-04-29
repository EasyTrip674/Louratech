/*
  Warnings:

  - You are about to drop the column `canCreateInvitation` on the `authorization` table. All the data in the column will be lost.
  - You are about to drop the column `canCreateMember` on the `authorization` table. All the data in the column will be lost.
  - You are about to drop the column `canCreateTeam` on the `authorization` table. All the data in the column will be lost.
  - You are about to drop the column `canDeleteInvitation` on the `authorization` table. All the data in the column will be lost.
  - You are about to drop the column `canDeleteMember` on the `authorization` table. All the data in the column will be lost.
  - You are about to drop the column `canDeleteTeam` on the `authorization` table. All the data in the column will be lost.
  - You are about to drop the column `canEditInvitation` on the `authorization` table. All the data in the column will be lost.
  - You are about to drop the column `canEditMember` on the `authorization` table. All the data in the column will be lost.
  - You are about to drop the column `canReadInvitation` on the `authorization` table. All the data in the column will be lost.
  - You are about to drop the column `canReadMember` on the `authorization` table. All the data in the column will be lost.
  - You are about to drop the column `canReadTeam` on the `authorization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "authorization" DROP COLUMN "canCreateInvitation",
DROP COLUMN "canCreateMember",
DROP COLUMN "canCreateTeam",
DROP COLUMN "canDeleteInvitation",
DROP COLUMN "canDeleteMember",
DROP COLUMN "canDeleteTeam",
DROP COLUMN "canEditInvitation",
DROP COLUMN "canEditMember",
DROP COLUMN "canReadInvitation",
DROP COLUMN "canReadMember",
DROP COLUMN "canReadTeam",
ADD COLUMN     "canCreateStep" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canDeleteStep" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canReadStep" BOOLEAN NOT NULL DEFAULT false;
