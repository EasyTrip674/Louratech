"use server"

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { deleteTransactionSchema } from "./transaction.delete.shema";
import { transactionService } from "@/lib/services";

export const doDeleteTransaction = adminAction
  .metadata({ actionName: "delete transaction" })
  .schema(deleteTransactionSchema)
  .action(async ({ clientInput, ctx }) => {
    try {
      console.log("Deleting transaction:", clientInput.transactionId);

      // Vérifier l'autorisation
      if (!ctx.user.userDetails?.authorize?.canDeleteTransaction) {
        throw new Error("Vous n'êtes pas autorisé à supprimer cette transaction");
      }

      // Utiliser le service transaction
      await transactionService.deleteTransaction(clientInput.transactionId);

      // Revalider le cache seulement si la transaction a réussi
      revalidatePath("/app/(admin)/services/gestion/finances");
      
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de la transaction:", error);
      throw new Error(`Échec de la suppression de la transaction: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });