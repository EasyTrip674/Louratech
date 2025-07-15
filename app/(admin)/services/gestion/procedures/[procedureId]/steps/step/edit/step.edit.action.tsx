"use server"

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { editStepProcedureSchema } from "./step.edit.shema";
import { procedureService } from "@/lib/services";

export const doEditStep = adminAction
    .metadata({actionName:"edit step"})
    .schema(editStepProcedureSchema)
    .action(async ({ clientInput, ctx }) => {
        try {
            console.log("Editing step with data:", clientInput);

            // Vérifier l'autorisation
            if (!ctx.user.userDetails?.authorize?.canEditStep) {
                throw new Error("Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
            }

            // Utiliser le service procedure
            const step = await procedureService.updateStep({
                id: clientInput.stepId,
                name: clientInput.name,
                description: clientInput.description,
                price: clientInput.price,
                order: clientInput.order,
                estimatedDuration: clientInput.estimatedDuration,
                required: clientInput.isRequired,
            });

            revalidatePath("/app/(admin)/services/gestion/procedures");
            
            return { success: true, step };
        } catch (error) {
            console.error("Erreur lors de la modification de l'étape:", error);
            throw new Error(`Échec de la modification de l'étape: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    });
