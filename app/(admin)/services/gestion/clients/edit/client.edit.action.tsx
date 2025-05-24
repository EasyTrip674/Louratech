"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { editClientSchema } from "./client.edit.shema";

export const doEditClient = adminAction
    .metadata({actionName:"edit client"}) // ✅ Ajout des métadonnées obligatoires
    .schema(editClientSchema)
    .action(async ({ clientInput ,ctx}) => {
        console.log("editing client with data:", clientInput);
        // TODO: Vérifier si l'utilisateur est autorisé à modifier le client
        if (ctx.user.userDetails?.authorize?.canEditClient === false) {
            throw new Error("Vous n'êtes pas autorisé à modifier cet utilisateur");
        }
        // TODO: Mettre a jour les données du client dans la base de données
        const client = await prisma.client.update({
            where: {
                id: clientInput.id,
            },
            data: {
                phone: clientInput.phone,
                passport: clientInput.passport,
                address: clientInput.address,
                birthDate: clientInput.birthDate ? new Date(clientInput.birthDate) : undefined,
                fatherLastName: clientInput.fatherLastName,
                fatherFirstName: clientInput.fatherFirstName,
                motherLastName: clientInput.motherLastName,
                motherFirstName: clientInput.motherFirstName,

                user: {
                    update: {
                         firstName: clientInput.firstName,
                         lastName: clientInput.lastName,
                         email: clientInput.email
                    },
                },
            },
        });

        revalidatePath("/app/(admin)/services/gestion/clients");
        
        return { success: true, client };
    });
