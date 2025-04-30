import { z } from "zod";

export const authorizationSchema = z.object({
  userId: z.string().nonempty("L'ID de l'utilisateur est requis"),
  authozationId: z.string().nonempty("L'ID de l'authozation est requis"),
  authorization: z.object({
        canChangeUserAuthorization: z.boolean(),
        canCreateStep: z.boolean(),
        canChangeUserPassword: z.boolean(),
        canCreateOrganization: z.boolean(),
        canCreateClient: z.boolean(),
        canCreateProcedure: z.boolean(),
        canCreateTransaction: z.boolean(),
        canCreateInvoice: z.boolean(),
        canCreateExpense: z.boolean(),
        canCreateRevenue: z.boolean(),
        canCreateComptaSettings: z.boolean(),
        canCreateAdmin: z.boolean(),
        
        canCreateInvitation: z.boolean(),
        canCreateClientProcedure: z.boolean(),
        canCreateClientStep: z.boolean(),
        canCreateClientDocument: z.boolean(),
        canReadOrganization: z.boolean(),
        canReadClient: z.boolean(),
        canReadProcedure: z.boolean(),
        canReadTransaction: z.boolean(),
        canReadInvoice: z.boolean(),
        canReadExpense: z.boolean(),
        canReadRevenue: z.boolean(),
        canReadComptaSettings: z.boolean(),
        canReadStep: z.boolean(),

        canReadAdmin: z.boolean(),

        canReadInvitation: z.boolean(),
        canReadClientProcedure: z.boolean(),
        canReadClientStep: z.boolean(),
        canReadClientDocument: z.boolean(),
        canEditOrganization: z.boolean(),
        canEditClient: z.boolean(),
        canEditProcedure: z.boolean(),
        canEditTransaction: z.boolean(),
        canEditInvoice: z.boolean(),
        canEditExpense: z.boolean(),
        canEditRevenue: z.boolean(),
        canEditComptaSettings: z.boolean(),
        canEditStep: z.boolean(),

        canEditAdmin: z.boolean(),

        canEditInvitation: z.boolean(),
        canEditClientProcedure: z.boolean(),
        canEditClientStep: z.boolean(),
        canEditClientDocument: z.boolean(),
        canDeleteOrganization: z.boolean(),
        canDeleteClient: z.boolean(),
        canDeleteProcedure: z.boolean(),
        canDeleteTransaction: z.boolean(),
        canDeleteInvoice: z.boolean(),
        canDeleteExpense: z.boolean(),
        canDeleteAdmin: z.boolean(),
        canDeleteRevenue: z.boolean(),
        canDeleteComptaSettings: z.boolean(),
        canDeleteStep: z.boolean(),
        canDeleteInvitation: z.boolean(),
        
        
        canDeleteClientProcedure: z.boolean(),
        canDeleteClientStep: z.boolean(),
        canDeleteClientDocument: z.boolean()
  }),
});

export type authorizationSchema = z.infer<typeof authorizationSchema>;