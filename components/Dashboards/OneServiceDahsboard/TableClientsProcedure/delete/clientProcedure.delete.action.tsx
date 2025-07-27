"use server";

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache"
import { deleteClientProcedureSchema } from "./stepClient.delete.shema"
import { procedureService } from "@/lib/services";

export const doDeleteClientProcedure = adminAction
  .metadata({ actionName: "delete ClientProcedure" })
  .schema(deleteClientProcedureSchema)
  .action(async ({ clientInput, ctx }) => {
    try {
      console.log("Deleting ClientProcedure:", clientInput.ClientProcedureName);

      // Vérifier l'autorisation
      if (!ctx.user.userDetails?.authorize?.canDeleteClientProcedure) {
        throw new Error("Vous n'êtes pas autorisé à supprimer ce module");
      }

      // Utiliser le service ClientProcedure
      const result = await procedureService.deleteClientProcedure(clientInput.ClientProcedureId, clientInput.deleteTransactionAssocied ?? false);

      // Revalider le cache seulement après une transaction réussie
      revalidatePath("/app/services/gestion/");
      
      console.log(`ClientProcedure deleted successfully`);
      return result;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étape:", error);
      throw new Error(`Échec de la suppression de l'étape: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });