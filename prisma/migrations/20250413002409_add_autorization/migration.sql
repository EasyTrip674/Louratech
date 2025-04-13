-- AlterTable
ALTER TABLE "account" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "team" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "authorization" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "canChangeUserAuthorization" BOOLEAN NOT NULL DEFAULT false,
    "canChangeUserPassword" BOOLEAN NOT NULL DEFAULT false,
    "canCreateOrganization" BOOLEAN NOT NULL DEFAULT false,
    "canCreateClient" BOOLEAN NOT NULL DEFAULT false,
    "canCreateProcedure" BOOLEAN NOT NULL DEFAULT false,
    "canCreateTransaction" BOOLEAN NOT NULL DEFAULT false,
    "canCreateInvoice" BOOLEAN NOT NULL DEFAULT false,
    "canCreateExpense" BOOLEAN NOT NULL DEFAULT false,
    "canCreateRevenue" BOOLEAN NOT NULL DEFAULT false,
    "canCreateComptaSettings" BOOLEAN NOT NULL DEFAULT false,
    "canCreateTeam" BOOLEAN NOT NULL DEFAULT false,
    "canCreateMember" BOOLEAN NOT NULL DEFAULT false,
    "canCreateInvitation" BOOLEAN NOT NULL DEFAULT false,
    "canCreateClientProcedure" BOOLEAN NOT NULL DEFAULT false,
    "canCreateClientStep" BOOLEAN NOT NULL DEFAULT false,
    "canCreateClientDocument" BOOLEAN NOT NULL DEFAULT false,
    "canReadOrganization" BOOLEAN NOT NULL DEFAULT false,
    "canReadClient" BOOLEAN NOT NULL DEFAULT false,
    "canReadProcedure" BOOLEAN NOT NULL DEFAULT false,
    "canReadTransaction" BOOLEAN NOT NULL DEFAULT false,
    "canReadInvoice" BOOLEAN NOT NULL DEFAULT false,
    "canReadExpense" BOOLEAN NOT NULL DEFAULT false,
    "canReadRevenue" BOOLEAN NOT NULL DEFAULT false,
    "canReadComptaSettings" BOOLEAN NOT NULL DEFAULT false,
    "canReadTeam" BOOLEAN NOT NULL DEFAULT false,
    "canReadMember" BOOLEAN NOT NULL DEFAULT false,
    "canReadInvitation" BOOLEAN NOT NULL DEFAULT false,
    "canReadClientProcedure" BOOLEAN NOT NULL DEFAULT false,
    "canReadClientStep" BOOLEAN NOT NULL DEFAULT false,
    "canReadClientDocument" BOOLEAN NOT NULL DEFAULT false,
    "canEditOrganization" BOOLEAN NOT NULL DEFAULT false,
    "canEditClient" BOOLEAN NOT NULL DEFAULT false,
    "canEditProcedure" BOOLEAN NOT NULL DEFAULT false,
    "canEditTransaction" BOOLEAN NOT NULL DEFAULT false,
    "canEditInvoice" BOOLEAN NOT NULL DEFAULT false,
    "canEditExpense" BOOLEAN NOT NULL DEFAULT false,
    "canEditRevenue" BOOLEAN NOT NULL DEFAULT false,
    "canEditComptaSettings" BOOLEAN NOT NULL DEFAULT false,
    "canEditTeam" BOOLEAN NOT NULL DEFAULT false,
    "canEditMember" BOOLEAN NOT NULL DEFAULT false,
    "canEditInvitation" BOOLEAN NOT NULL DEFAULT false,
    "canEditClientProcedure" BOOLEAN NOT NULL DEFAULT false,
    "canEditClientStep" BOOLEAN NOT NULL DEFAULT false,
    "canEditClientDocument" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteOrganization" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteClient" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteProcedure" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteTransaction" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteInvoice" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteExpense" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteRevenue" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteComptaSettings" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteTeam" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteMember" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteInvitation" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteClientProcedure" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteClientStep" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteClientDocument" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authorization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authorization_userId_key" ON "authorization"("userId");

-- AddForeignKey
ALTER TABLE "authorization" ADD CONSTRAINT "authorization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
