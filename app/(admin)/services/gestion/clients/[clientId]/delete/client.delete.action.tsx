"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { deleteClientSchema } from "./client.delete.shema";

export const doDeleteClient = adminAction
    .metadata({actionName:"edit client"}) // ✅ Ajout des métadonnées obligatoires
    .schema(deleteClientSchema)
    .action(async ({ clientInput, ctx }) => {
        console.log("deleting client with data:", clientInput);
        
        // Vérifier si l'utilisateur est autorisé à supprimer le client
        if (ctx.user.userDetails?.authorize?.canDeleteClient === false) {
            throw new Error("Vous n'êtes pas autorisé à supprimer ce client");
        }

        try {
            // 1. Récupérer l'ID utilisateur associé au client
            const client = await prisma.client.findUnique({
                where: { id: clientInput.id },
                include: { user: true }
            });

            if (!client) {
                throw new Error("Client introuvable");
            }

            const userId = client.userId;

            // 2. Supprimer ou mettre à jour les relations qui pourraient bloquer la suppression
            // Supprimer les documents client
            await prisma.clientDocument.deleteMany({
                where: { 
                    clientProcedure: { 
                        clientId: clientInput.id 
                    } 
                }
            });

            // Supprimer les étapes client
            await prisma.clientStep.deleteMany({
                where: { 
                    clientProcedure: { 
                        clientId: clientInput.id 
                    } 
                }
            });

            // Supprimer les procédures client
            await prisma.clientProcedure.deleteMany({
                where: { 
                    clientId: clientInput.id 
                }
            });

            // Déconnecter le client des factures (mettre clientId à null)
            await prisma.invoice.updateMany({
                where: { clientId: clientInput.id },
                data: { clientId: "" }
            });

            // 3. Supprimer le client
            await prisma.client.delete({
                where: { id: clientInput.id }
            });

            // 4. Supprimer l'utilisateur associé si nécessaire (ou simplement le déconnecter de l'organisation)
            await prisma.user.update({
                where: { id: userId },
                data: { 
                    organizationId: null,
                    active: false
                }
            });

            // 5. Supprimer l'adhésion à l'organisation si elle existe
            await prisma.member.deleteMany({
                where: { userId: userId }
            });

            revalidatePath("/app/(admin)/services/gestion/clients");
            return { success: true };
        } catch (error) {
            console.error("Erreur lors de la suppression du client:", error);
            throw new Error(`Échec de la suppression du client: ${error}`);
        }
    });