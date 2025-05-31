"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma"
import { revalidatePath } from "next/cache"
import { deleteStepSchema } from "./step.delete.shema"

export const doDeleteStep = adminAction
  .metadata({ actionName: "delete step" }) // Fixed metadata name
  .schema(deleteStepSchema)
  .action(async ({ clientInput, ctx }) => {
    console.log("Deleting step:", clientInput.stepId)

    // Authorization check
    if (!ctx.user.userDetails?.authorize?.canDeleteStep) {
      throw new Error("Vous n'êtes pas autorisé à supprimer ce module")
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Find and validate step existence
        const step = await tx.stepProcedure.findUnique({
          where: { id: clientInput.stepId },
          select: { id: true, name: true } // Only select needed fields
        })

        if (!step) {
          throw new Error("Module introuvable")
        }

        // 2. Get all related client steps (single query)
        const clientSteps = await tx.clientStep.findMany({
          where: { stepId: step.id },
          select: { id: true }
        })

        const clientStepIds = clientSteps.map(cs => cs.id)

        // 3. Handle transactions based on deletion preference
        if (clientInput.deleteTransactionAssocied) {
          // Find all related transactions in one query
          const transactions = await tx.transaction.findMany({
            where: {
              OR: [
                { stepId: step.id },
                { clientStepId: { in: clientStepIds } }
              ]
            },
            select: { id: true }
          })

          if (transactions.length > 0) {
            const transactionIds = transactions.map(t => t.id)

            // Delete revenues and transactions in parallel
            await Promise.all([
              tx.revenue.deleteMany({
                where: { transactionId: { in: transactionIds } }
              }),
              // Remove duplicate revenue deletion
            ])

            await tx.transaction.deleteMany({
              where: { id: { in: transactionIds } }
            })
          }
        } else {
          // Nullify step references in transactions
          await tx.transaction.updateMany({
            where: { stepId: step.id },
            data: { stepId: null }
          })
        }

        // 4. Delete related records in optimal order
        await Promise.all([
          // Delete client steps
          tx.clientStep.deleteMany({
            where: { stepId: step.id }
          })
        ])

        // 5. Finally delete the main step
        await tx.stepProcedure.delete({
          where: { id: step.id }
        })

        return { 
          success: true, 
          deletedStep: { 
            id: step.id, 
            name: step.name 
          } 
        }
      })

      // Revalidate cache only after successful transaction
      revalidatePath("/app/(admin)/services/gestion")
      
      console.log(`Step ${result.deletedStep.name} deleted successfully`)
      return result

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error("Step deletion failed:", errorMessage)
      
      // Re-throw with context
      throw new Error(`Échec de la suppression du step: ${errorMessage}`)
    }
  })