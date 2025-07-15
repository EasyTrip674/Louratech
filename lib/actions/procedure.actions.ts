"use server";

import { adminAction } from "@/lib/safe-action";
import { procedureService } from "@/lib/services";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schémas de validation pour les procédures
const createProcedureSchema = z.object({
  name: z.string().min(1, "Le nom de la procédure est requis"),
  description: z.string().optional(),
});

const updateProcedureSchema = z.object({
  id: z.string().min(1, "ID requis"),
  name: z.string().min(1, "Le nom de la procédure est requis"),
  description: z.string().optional(),
});

const deleteProcedureSchema = z.object({
  id: z.string().min(1, "ID requis"),
  deleteTransaction:z.boolean().default(false)
});

// Schémas de validation pour les étapes
const createStepSchema = z.object({
  name: z.string().min(1, "Le nom de l'étape est requis"),
  description: z.string().optional(),
  price: z.number().optional(),
  procedureId: z.string().min(1, "ID de la procédure requis"),
  order: z.number().optional(),
  required: z.boolean().optional(),
  estimatedDuration: z.number().optional(),
});

const updateStepSchema = z.object({
  id: z.string().min(1, "ID requis"),
  name: z.string().min(1, "Le nom de l'étape est requis"),
  description: z.string().optional(),
  price: z.number().optional(),
  required: z.boolean().optional(),
  estimatedDuration: z.number().optional(),
});

const deleteStepSchema = z.object({
  id: z.string().min(1, "ID requis"),
  deleteTransaction:z.boolean().default(false)
});

// Actions pour les procédures
export const createProcedureAction = adminAction
  .metadata({ actionName: "create procedure" })
  .schema(createProcedureSchema)
  .action(async ({ clientInput }) => {
    try {
      const procedure = await procedureService.createProcedure(clientInput);
      
      revalidatePath("/app/(admin)/services/gestion/procedures");
      
      return { success: true, procedure };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const updateProcedureAction = adminAction
  .metadata({ actionName: "update procedure" })
  .schema(updateProcedureSchema)
  .action(async ({ clientInput }) => {
    try {
      const procedure = await procedureService.updateProcedure(clientInput);
      
      revalidatePath("/app/(admin)/services/gestion/procedures");
      
      return { success: true, procedure };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const deleteProcedureAction = adminAction
  .metadata({ actionName: "delete procedure" })
  .schema(deleteProcedureSchema)
  .action(async ({ clientInput }) => {
    try {
      await procedureService.deleteProcedure(clientInput.id, clientInput.deleteTransaction ?? false);
      
      revalidatePath("/app/(admin)/services/gestion/procedures");
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

// Actions pour les étapes
export const createStepAction = adminAction
  .metadata({ actionName: "create step" })
  .schema(createStepSchema)
  .action(async ({ clientInput }) => {
    try {
      const step = await procedureService.createStep(clientInput);
      
      revalidatePath("/app/(admin)/services/gestion/procedures");
      
      return { success: true, step };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const updateStepAction = adminAction
  .metadata({ actionName: "update step" })
  .schema(updateStepSchema)
  .action(async ({ clientInput }) => {
    try {
      const step = await procedureService.updateStep(clientInput);
      
      revalidatePath("/app/(admin)/services/gestion/procedures");
      
      return { success: true, step };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const deleteStepAction = adminAction
  .metadata({ actionName: "delete step" })
  .schema(deleteStepSchema)
  .action(async ({ clientInput }) => {
    try {
      await procedureService.deleteStep(clientInput.id, clientInput.deleteTransaction ?? false);
      
      revalidatePath("/app/(admin)/services/gestion/procedures");
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  }); 