-- CreateEnum
CREATE TYPE "FeedbackImpact" AS ENUM ('CRITICAL', 'MAJOR', 'MINOR');

-- CreateEnum
CREATE TYPE "FeedbackSatisfaction" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "browser" TEXT,
ADD COLUMN     "device" TEXT,
ADD COLUMN     "impact" "FeedbackImpact",
ADD COLUMN     "pageUrl" TEXT,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "response" TEXT,
ADD COLUMN     "responseAt" TIMESTAMP(3),
ADD COLUMN     "satisfaction" "FeedbackSatisfaction",
ADD COLUMN     "status" "FeedbackStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "subtype" TEXT;
