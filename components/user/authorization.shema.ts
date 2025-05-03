import { z } from "zod";

export const authorizationSchema = z.object({
  userId: z.string().nonempty("L'ID de l'utilisateur est requis"),
  authorizationId: z.string().nonempty("L'ID de l'autorisation est requis"),
  authorization: z.object({
    // Permissions générales
    canChangeUserAuthorization: z.boolean().default(false),
    canChangeUserPassword: z.boolean().default(false),
    
    // Permissions de création
    canCreateOrganization: z.boolean().default(false),
    canCreateStep: z.boolean().default(false),
    canCreateClient: z.boolean().default(false),
    canCreateProcedure: z.boolean().default(false),
    canCreateTransaction: z.boolean().default(false),
    canCreateAdmin: z.boolean().default(false),
    canCreateInvoice: z.boolean().default(false),
    canCreateExpense: z.boolean().default(false),
    canCreateRevenue: z.boolean().default(false),
    canCreateComptaSettings: z.boolean().default(false),
    canCreateClientProcedure: z.boolean().default(false),
    canCreateClientStep: z.boolean().default(false),
    canCreateClientDocument: z.boolean().default(false),
    
    // Permissions de lecture
    canReadOrganization: z.boolean().default(false),
    canReadStep: z.boolean().default(false),
    canReadClient: z.boolean().default(false),
    canReadProcedure: z.boolean().default(false),
    canReadTransaction: z.boolean().default(false),
    canReadInvoice: z.boolean().default(false),
    canReadExpense: z.boolean().default(false),
    canReadRevenue: z.boolean().default(false),
    canReadComptaSettings: z.boolean().default(false),
    canReadAdmin: z.boolean().default(false),
    canReadClientProcedure: z.boolean().default(false),
    canReadClientStep: z.boolean().default(false),
    canReadClientDocument: z.boolean().default(false),
    
    // Permissions de modification
    canEditOrganization: z.boolean().default(false),
    canEditStep: z.boolean().default(false),
    canEditClient: z.boolean().default(false),
    canEditProcedure: z.boolean().default(false),
    canEditTransaction: z.boolean().default(false),
    canEditInvoice: z.boolean().default(false),
    canEditExpense: z.boolean().default(false),
    canEditRevenue: z.boolean().default(false),
    canEditComptaSettings: z.boolean().default(false),
    canEditAdmin: z.boolean().default(false),
    canEditClientProcedure: z.boolean().default(false),
    canEditClientStep: z.boolean().default(false),
    canEditClientDocument: z.boolean().default(false),
    
    // Permissions de suppression
    canDeleteOrganization: z.boolean().default(false),
    canDeleteStep: z.boolean().default(false),
    canDeleteClient: z.boolean().default(false),
    canDeleteProcedure: z.boolean().default(false),
    canDeleteTransaction: z.boolean().default(false),
    canDeleteInvoice: z.boolean().default(false),
    canDeleteExpense: z.boolean().default(false),
    canDeleteAdmin: z.boolean().default(false),
    canDeleteRevenue: z.boolean().default(false),
    canDeleteComptaSettings: z.boolean().default(false),
    canDeleteClientProcedure: z.boolean().default(false),
    canDeleteClientStep: z.boolean().default(false),
    canDeleteClientDocument: z.boolean().default(false),

  }),
});

export type authorizationSchema = z.infer<typeof authorizationSchema>;