/*
  Warnings:

  - The values [NOT_STARTED,ON_HOLD,CANCELLED,REJECTED] on the enum `ProcedureStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProcedureStatus_new" AS ENUM ('IN_PROGRESS', 'COMPLETED');
ALTER TABLE "ClientProcedure" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ClientProcedure" ALTER COLUMN "status" TYPE "ProcedureStatus_new" USING ("status"::text::"ProcedureStatus_new");
ALTER TYPE "ProcedureStatus" RENAME TO "ProcedureStatus_old";
ALTER TYPE "ProcedureStatus_new" RENAME TO "ProcedureStatus";
DROP TYPE "ProcedureStatus_old";
ALTER TABLE "ClientProcedure" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
COMMIT;

-- AlterTable
ALTER TABLE "ClientProcedure" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
