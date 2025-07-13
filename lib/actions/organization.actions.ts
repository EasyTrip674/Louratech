"use server";

import { adminAction } from "@/lib/safe-action";
import { organizationService } from "@/lib/services";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schémas de validation pour l'organisation
const updateOrganizationSchema = z.object({
  id: z.string().min(1, "ID requis"),
  name: z.string().min(1, "Le nom de l'organisation est requis"),
  description: z.string().optional(),
  logo: z.string().optional(),
  slug: z.string().optional(),
});

// Schémas de validation pour les paramètres comptables
const updateComptaSettingsSchema = z.object({
  fiscalYear: z.string().min(1, "L'année fiscale est requise"),
  taxIdentification: z.string().optional(),
  currency: z.string().min(1, "La devise est requise"),
  defaultTaxRate: z.number().optional(),
  invoicePrefix: z.string().optional(),
  invoiceNumberFormat: z.string().optional(),
});

// Actions serveur
export const updateOrganizationAction = adminAction
  .metadata({ actionName: "update organization" })
  .schema(updateOrganizationSchema)
  .action(async ({ clientInput }) => {
    try {
      const organization = await organizationService.updateOrganization({
        id: clientInput.id,
        name: clientInput.name,
        description: clientInput.description,
        logo: clientInput.logo,
        slug: clientInput.slug,
      });
      
      revalidatePath("/app/(admin)/settings");
      
      return { success: true, organization };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const updateComptaSettingsAction = adminAction
  .metadata({ actionName: "update compta settings" })
  .schema(updateComptaSettingsSchema)
  .action(async ({ clientInput }) => {
    try {
      const comptaSettings = await organizationService.updateComptaSettings({
        fiscalYear: new Date(clientInput.fiscalYear),
        taxIdentification: clientInput.taxIdentification,
        currency: clientInput.currency,
        defaultTaxRate: clientInput.defaultTaxRate,
        invoicePrefix: clientInput.invoicePrefix,
        invoiceNumberFormat: clientInput.invoiceNumberFormat,
      });
      
      revalidatePath("/app/(admin)/settings");
      
      return { success: true, comptaSettings };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  }); 