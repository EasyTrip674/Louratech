"use server"

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { createStepProcedureSchema } from "./step.create.shema";
import { procedureService } from "@/lib/services";

export const doCreateStep = adminAction
    .metadata({actionName:"create step"})
    .schema(createStepProcedureSchema)
    .action(async ({ clientInput, ctx }) => {
        try {
            console.log("Creating step with data:", clientInput);

            // Vérifier l'autorisation
            if (!ctx.user.userDetails?.authorize?.canCreateStep) {
                throw new Error("Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
            }

            // Utiliser le service procedure
            const step = await procedureService.createStep(clientInput);

            revalidatePath("/app/(admin)/services/gestion/procedures");
            
            return { success: true, step };
        } catch (error) {
            console.error("Erreur lors de la création de l'étape:", error);
            throw new Error(`Échec de la création de l'étape: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    });
