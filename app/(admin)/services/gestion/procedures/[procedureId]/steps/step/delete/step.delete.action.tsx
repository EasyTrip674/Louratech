"use server"

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache"
import { deleteStepSchema } from "./step.delete.shema"
import { procedureService } from "@/lib/services";

export const doDeleteStep = adminAction
  .metadata({ actionName: "delete step" })
  .schema(deleteStepSchema)
  .action(async ({ clientInput, ctx }) => {
    try {
      console.log("Deleting step:", clientInput.stepId);

      // Vérifier l'autorisation
      if (!ctx.user.userDetails?.authorize?.canDeleteStep) {
        throw new Error("Vous n'êtes pas autorisé à supprimer ce module");
      }

      // Utiliser le service procedure
      const result = await procedureService.deleteStep(clientInput.stepId);

      // Revalider le cache seulement après une transaction réussie
      revalidatePath("/app/(admin)/services/gestion/procedures");
      
      console.log(`Step deleted successfully`);
      return result;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étape:", error);
      throw new Error(`Échec de la suppression de l'étape: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });