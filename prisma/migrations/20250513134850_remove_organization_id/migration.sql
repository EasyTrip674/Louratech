/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Feedback` table. All the data in the column will be lost.

*/
-- AlterTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "organizationId" TEXT,
    "type" "FeedbackType" NOT NULL DEFAULT 'OTHER',
    "message" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Feedback" DROP COLUMN "organizationId";
