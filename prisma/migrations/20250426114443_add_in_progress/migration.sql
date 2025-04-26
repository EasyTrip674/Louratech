/*
  Warnings:

  - The values [PENDING] on the enum `StepStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProcedureStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "ProcedureStatus" ADD VALUE 'FAILED';

-- AlterEnum
BEGIN;
CREATE TYPE "StepStatus_new" AS ENUM ('IN_PROGRESS', 'WAITING', 'COMPLETED', 'SKIPPED', 'FAILED');
ALTER TABLE "ClientStep" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ClientStep" ALTER COLUMN "status" TYPE "StepStatus_new" USING ("status"::text::"StepStatus_new");
ALTER TYPE "StepStatus" RENAME TO "StepStatus_old";
ALTER TYPE "StepStatus_new" RENAME TO "StepStatus";
DROP TYPE "StepStatus_old";
ALTER TABLE "ClientStep" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
COMMIT;

-- AlterTable
ALTER TABLE "ClientStep" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
