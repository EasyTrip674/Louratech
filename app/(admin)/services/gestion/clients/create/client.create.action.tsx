"use server"

import { adminAction } from "@/lib/safe-action"
import { createClientSchema } from "./client.create.shema"

export const doCreateClient = adminAction
    .metadata({actionName:"create client"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createClientSchema)
    .action(async ({ clientInput }) => {
        console.log("Creating client with data:", clientInput);
        
        // TODO: Sauvegarder les données du client dans la base de données
        
        return { success: true };
    });
