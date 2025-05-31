"use server"
import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { confirmMessage, deleteTransactionSchema } from "./transaction.delete.shema";

export const doDeleteTransaction = adminAction
  .metadata({actionName:"edit Transaction"}) // ✅ Ajout des métadonnées obligatoires
  .schema(deleteTransactionSchema)
  .action(async ({ clientInput, ctx }) => {
    console.log("deleting Transaction with data:", clientInput.transactionId);
    
    if (clientInput.confirmMessage !== confirmMessage) {
      throw new Error("Impossible de supprimer")
    }

    // Vérifier si l'utilisateur est autorisé à supprimer le Transaction
    if (ctx.user.userDetails?.authorize?.canDeleteTransaction === false) {
      throw new Error("Vous n'êtes pas autorisé à supprimer cette Transaction");
    }

    try {
      // Utilisation d'une transaction Prisma pour assurer l'intégrité des données
       await prisma.$transaction(async (tx) => {
        // 1. Récupérer l'ID utilisateur associé au Transaction
        const transaction = await tx.transaction.findUnique({
          where: { id: clientInput.transactionId },
          include: { user: true }
        });

        if (!transaction) {
          throw new Error("Transaction introuvable");
        }

        // 2. Supprimer les revenus associés
        await tx.revenue.deleteMany({
          where: {
            transactionId: transaction.id
          }
        });

        // 3. Supprimer les dépenses associées
        await tx.expense.deleteMany({
          where: {
            transactionId: transaction.id
          }
        });

        // 4. Supprimer la transaction
        await tx.transaction.delete({
          where: {
            id: transaction.id
          }
        });

        return { success: true, deletedTransaction: transaction };
      });

      // Revalider le cache seulement si la transaction a réussi
      revalidatePath("/app/(admin)/services/gestion");
      
      return { success: true };

    } catch (error) {
      console.error("Erreur lors de la suppression du Transaction:", error);
      
      // En cas d'erreur, la transaction Prisma fait automatiquement un rollback
      throw new Error(`Échec de la suppression du Transaction: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });