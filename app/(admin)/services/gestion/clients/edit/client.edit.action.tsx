"use server"

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { editClientSchema } from "./client.edit.shema";
import { clientService } from "@/lib/services";

export const doEditClient = adminAction
    .metadata({actionName:"edit client"})
    .schema(editClientSchema)
    .action(async ({ clientInput, ctx }) => {
        try {
            console.log("Editing client with data:", clientInput);
            
            // Vérifier l'autorisation
            if (ctx.user.userDetails?.authorize?.canEditClient === false) {
                throw new Error("Vous n'êtes pas autorisé à modifier ce client");
            }

            // Utiliser le service client
            const client = await clientService.updateClient(clientInput);

            revalidatePath("/app/(admin)/services/gestion/clients");
            
            return { success: true, client };
        } catch (error) {
            console.error("Erreur lors de la modification du client:", error);
            throw new Error(`Échec de la modification du client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    });
