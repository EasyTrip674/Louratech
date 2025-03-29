"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { editClientSchema } from "./client.edit.shema";

export const doEditClient = adminAction
    .metadata({actionName:"edit client"}) // ✅ Ajout des métadonnées obligatoires
    .schema(editClientSchema)
    .action(async ({ clientInput }) => {
        console.log("editing client with data:", clientInput);


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
                       
                    },
                },
            },
        });

        revalidatePath("/app/(admin)/services/gestion/clients");
        
        return { success: true, client };
    });
