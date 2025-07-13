"use server";

import { adminAction } from "@/lib/safe-action";
import { transactionService } from "@/lib/services";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schémas de validation
const createTransactionSchema = z.object({
  type: z.enum(["REVENUE", "EXPENSE", "TRANSFER"]),
  amount: z.number().positive("Le montant doit être positif"),
  description: z.string().min(1, "La description est requise"),
  date: z.string(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CHECK", "CREDIT_CARD", "MOBILE_PAYMENT"]),
  categoryId: z.string().optional(),
  clientProcedureId: z.string().optional(),
  clientStepId: z.string().optional(),
  revenueId: z.string().optional(),
  expenseId: z.string().optional(),
});

const updateTransactionSchema = z.object({
  id: z.string().min(1, "ID requis"),
  type: z.enum(["REVENUE", "EXPENSE", "TRANSFER"]),
  amount: z.number().positive("Le montant doit être positif"),
  description: z.string().min(1, "La description est requise"),
  date: z.string(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CHECK", "CREDIT_CARD", "MOBILE_PAYMENT"]),
  categoryId: z.string().optional(),
});

const deleteTransactionSchema = z.object({
  id: z.string().min(1, "ID requis"),
});

const approveTransactionSchema = z.object({
  id: z.string().min(1, "ID requis"),
});

const rejectTransactionSchema = z.object({
  id: z.string().min(1, "ID requis"),
  reason: z.string().optional(),
});

// Actions serveur
export const createTransactionAction = adminAction
  .metadata({ actionName: "create transaction" })
  .schema(createTransactionSchema)
  .action(async ({ clientInput }) => {
    try {
      const transaction = await transactionService.createTransaction(clientInput);
      
      revalidatePath("/app/(admin)/services/gestion/finances");
      
      return { success: true, transaction };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const updateTransactionAction = adminAction
  .metadata({ actionName: "update transaction" })
  .schema(updateTransactionSchema)
  .action(async ({ clientInput }) => {
    try {
      const transaction = await transactionService.updateTransaction(clientInput);
      
      revalidatePath("/app/(admin)/services/gestion/finances");
      
      return { success: true, transaction };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const deleteTransactionAction = adminAction
  .metadata({ actionName: "delete transaction" })
  .schema(deleteTransactionSchema)
  .action(async ({ clientInput }) => {
    try {
      await transactionService.deleteTransaction(clientInput.id);
      
      revalidatePath("/app/(admin)/services/gestion/finances");
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const approveTransactionAction = adminAction
  .metadata({ actionName: "approve transaction" })
  .schema(approveTransactionSchema)
  .action(async ({ clientInput }) => {
    try {
      const transaction = await transactionService.approveTransaction(clientInput.id);
      
      revalidatePath("/app/(admin)/services/gestion/finances");
      
      return { success: true, transaction };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const rejectTransactionAction = adminAction
  .metadata({ actionName: "reject transaction" })
  .schema(rejectTransactionSchema)
  .action(async () => {
    try {
      // Note: rejectTransaction n'existe pas encore dans le service
      // Cette action sera implémentée plus tard
      throw new Error("Fonctionnalité non implémentée");
      
      revalidatePath("/app/(admin)/services/gestion/finances");
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  }); 