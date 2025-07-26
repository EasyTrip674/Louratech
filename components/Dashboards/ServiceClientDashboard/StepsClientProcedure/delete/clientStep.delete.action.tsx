"use server";

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache"
import { deleteClientStepSchema } from "./stepClient.delete.shema"
import { procedureService } from "@/lib/services";

export const doDeleteClientStep = adminAction
  .metadata({ actionName: "delete ClientStep" })
  .schema(deleteClientStepSchema)
  .action(async ({ clientInput, ctx }) => {
    try {
      console.log("Deleting ClientStep:", clientInput.ClientStepName);

      // Vérifier l'autorisation
      if (!ctx.user.userDetails?.authorize?.canDeleteClientStep) {
        throw new Error("Vous n'êtes pas autorisé à supprimer ce module");
      }

      // Utiliser le service ClientStep
      const result = await procedureService.deleteClientStep(clientInput.ClientStepId, clientInput.deleteTransactionAssocied ?? false);

      // Revalider le cache seulement après une transaction réussie
      revalidatePath("/app/services/gestion/");
      
      console.log(`ClientStep deleted successfully`);
      return result;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étape:", error);
      throw new Error(`Échec de la suppression de l'étape: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });