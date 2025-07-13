"use server"

import { adminAction } from "@/lib/safe-action"
import { editProcedureScheme } from "./procedure.edit.sheme"
import { revalidatePath } from "next/cache";
import { procedureService } from "@/lib/services";

export const doEditProcedure = adminAction
    .metadata({actionName:"edit Procedure"})
    .schema(editProcedureScheme)
    .action(async ({ clientInput, ctx }) => {
        try {
            console.log("Editing Procedure with data:", clientInput);

            // Vérifier l'autorisation
            if (ctx.user.userDetails?.authorize?.canEditProcedure === false) {
                throw new Error("Vous n'êtes pas autorisé à modifier ce service");
            }

            // Utiliser le service procedure
            const procedure = await procedureService.updateProcedure({
                id: clientInput.procedureId,
                name: clientInput.name,
                description: clientInput.description
            });

            revalidatePath("/app/(admin)/services/gestion/procedures");
            
            return { success: true, procedure };
        } catch (error) {
            console.error("Erreur lors de la modification de la procédure:", error);
            throw new Error(`Échec de la modification de la procédure: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    });
