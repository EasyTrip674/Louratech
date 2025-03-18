-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "clientStepId" TEXT,
ADD COLUMN     "procedureId" TEXT,
ADD COLUMN     "stepId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientStepId_fkey" FOREIGN KEY ("clientStepId") REFERENCES "ClientStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientProcedureId_fkey" FOREIGN KEY ("clientProcedureId") REFERENCES "ClientProcedure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "StepProcedure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
