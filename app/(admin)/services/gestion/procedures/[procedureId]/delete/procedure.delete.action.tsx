"use server"

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache"
import { deleteProcedureSchema } from "./procedure.delete.shema"
import { procedureService } from "@/lib/services";

export const doDeleteProcedure = adminAction
  .metadata({ actionName: "delete procedure" })
  .schema(deleteProcedureSchema)
  .action(async ({ clientInput, ctx }) => {
    try {
      console.log("Deleting procedure:", clientInput.procedureName);

      // Vérifier l'autorisation
      if (!ctx.user.userDetails?.authorize?.canDeleteProcedure) {
        throw new Error("Vous n'êtes pas autorisé à supprimer ce module");
      }

      // Utiliser le service procedure
      const result = await procedureService.deleteProcedure(clientInput.procedureId, clientInput.deleteTransactionAssocied ?? false);

      // Revalider le cache seulement après une transaction réussie
      revalidatePath("/app/(admin)/services/gestion/procedures");
      
      console.log(`procedure deleted successfully`);
      return result;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étape:", error);
      throw new Error(`Échec de la suppression de l'étape: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });