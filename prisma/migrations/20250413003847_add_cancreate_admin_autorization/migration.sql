-- AlterTable
ALTER TABLE "authorization" ADD COLUMN     "canCreateAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canDeleteAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canReadAdmin" BOOLEAN NOT NULL DEFAULT false;
