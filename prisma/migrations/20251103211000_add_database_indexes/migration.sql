-- CreateIndex
CREATE INDEX "Admin_organizationId_idx" ON "Admin"("organizationId");

-- CreateIndex
CREATE INDEX "Admin_userId_idx" ON "Admin"("userId");

-- CreateIndex
CREATE INDEX "Client_organizationId_idx" ON "Client"("organizationId");

-- CreateIndex
CREATE INDEX "Client_email_idx" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_organizationId_lastName_idx" ON "Client"("organizationId", "lastName");

-- CreateIndex
CREATE INDEX "ClientProcedure_organizationId_status_idx" ON "ClientProcedure"("organizationId", "status");

-- CreateIndex
CREATE INDEX "ClientProcedure_organizationId_startDate_idx" ON "ClientProcedure"("organizationId", "startDate");

-- CreateIndex
CREATE INDEX "ClientProcedure_procedureId_idx" ON "ClientProcedure"("procedureId");

-- CreateIndex
CREATE INDEX "ClientProcedure_clientId_idx" ON "ClientProcedure"("clientId");

-- CreateIndex
CREATE INDEX "ClientProcedure_assignedToId_idx" ON "ClientProcedure"("assignedToId");

-- CreateIndex
CREATE INDEX "ClientProcedure_managerId_idx" ON "ClientProcedure"("managerId");

-- CreateIndex
CREATE INDEX "ClientProcedure_status_idx" ON "ClientProcedure"("status");

-- CreateIndex
CREATE INDEX "ClientStep_clientProcedureId_idx" ON "ClientStep"("clientProcedureId");

-- CreateIndex
CREATE INDEX "ClientStep_stepId_idx" ON "ClientStep"("stepId");

-- CreateIndex
CREATE INDEX "ClientStep_status_idx" ON "ClientStep"("status");

-- CreateIndex
CREATE INDEX "ClientStep_processedById_idx" ON "ClientStep"("processedById");

-- CreateIndex
CREATE INDEX "ClientStep_clientProcedureId_status_idx" ON "ClientStep"("clientProcedureId", "status");

-- CreateIndex
CREATE INDEX "Invoice_organizationId_status_idx" ON "Invoice"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Invoice_clientId_idx" ON "Invoice"("clientId");

-- CreateIndex
CREATE INDEX "Invoice_invoiceNumber_idx" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_organizationId_issuedDate_idx" ON "Invoice"("organizationId", "issuedDate");

-- CreateIndex
CREATE INDEX "Procedure_organizationId_idx" ON "Procedure"("organizationId");

-- CreateIndex
CREATE INDEX "Procedure_organizationId_isActive_idx" ON "Procedure"("organizationId", "isActive");

-- CreateIndex
CREATE INDEX "Procedure_isActive_idx" ON "Procedure"("isActive");

-- CreateIndex
CREATE INDEX "StepProcedure_procedureId_idx" ON "StepProcedure"("procedureId");

-- CreateIndex
CREATE INDEX "StepProcedure_procedureId_order_idx" ON "StepProcedure"("procedureId", "order");

-- CreateIndex
CREATE INDEX "Transaction_organizationId_type_status_idx" ON "Transaction"("organizationId", "type", "status");

-- CreateIndex
CREATE INDEX "Transaction_organizationId_date_idx" ON "Transaction"("organizationId", "date");

-- CreateIndex
CREATE INDEX "Transaction_organizationId_createdAt_idx" ON "Transaction"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_clientProcedureId_idx" ON "Transaction"("clientProcedureId");

-- CreateIndex
CREATE INDEX "Transaction_clientStepId_idx" ON "Transaction"("clientStepId");

-- CreateIndex
CREATE INDEX "Transaction_categoryId_idx" ON "Transaction"("categoryId");

-- CreateIndex
CREATE INDEX "Transaction_createdById_idx" ON "Transaction"("createdById");

-- CreateIndex
CREATE INDEX "User_organizationId_role_idx" ON "User"("organizationId", "role");

-- CreateIndex
CREATE INDEX "User_organizationId_active_idx" ON "User"("organizationId", "active");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "session_activeorganizationId_idx" ON "session"("activeorganizationId");

-- CreateIndex
CREATE INDEX "session_token_idx" ON "session"("token");
