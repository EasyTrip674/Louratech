"use server"

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { deleteClientSchema } from "./client.delete.shema";
import { clientService } from "@/lib/services";

export const doDeleteClient = adminAction
    .metadata({actionName:"delete client"})
    .schema(deleteClientSchema)
    .action(async ({ clientInput, ctx }) => {
        try {
            
            // Vérifier l'autorisation
            if (ctx.user.userDetails?.authorize?.canDeleteClient === false) {
                throw new Error("Vous n'êtes pas autorisé à supprimer ce client");
            }

            // Utiliser le service client
            await clientService.deleteClient(clientInput.id);

            revalidatePath("/app/(admin)/services/gestion/clients");
            return { success: true };
        } catch (error) {
            console.error("Erreur lors de la suppression du client:", error);
            throw new Error(`Échec de la suppression du client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    });