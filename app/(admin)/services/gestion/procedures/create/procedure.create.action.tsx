"use server"

import { adminAction } from "@/lib/safe-action"
import { createProcedureScheme } from "./procedure.create.sheme"
import { revalidatePath } from "next/cache";
import { procedureService } from "@/lib/services";

export const doCreateProcedure = adminAction
    .metadata({actionName:"create Procedure"})
    .schema(createProcedureScheme)
    .action(async ({ clientInput, ctx }) => {
        try {
            console.log("Creating Procedure with data:", clientInput);

            // Vérifier l'autorisation
            if (ctx.user.userDetails?.authorize?.canCreateProcedure === false) {
                throw new Error("Vous n'êtes pas autorisé à créer un service");
            }

            // Utiliser le service procedure
            const procedure = await procedureService.createProcedure(clientInput);

            revalidatePath("/app/(admin)/services/gestion/procedures");
            
            return { success: true, procedure };
        } catch (error) {
            console.error("Erreur lors de la création de la procédure:", error);
            throw new Error(`Échec de la création de la procédure: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    });
