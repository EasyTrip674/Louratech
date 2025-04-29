"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { editEmployeeSheme } from "./employee.edit.shema";

export const doEditEmployee = adminAction
    .metadata({actionName:"edit admin"}) // ✅ Ajout des métadonnées obligatoires
    .schema(editEmployeeSheme)
    .action(async ({ clientInput,ctx }) => {
        console.log("editing admin with data:", clientInput);

        // verifiier s'il est authorisé
        if (ctx.user.userDetails?.authorize?.canEditAdmin === false) {
            throw new Error("Vous n'êtes pas autorisé à modifier cet utilisateur");
        }


        // TODO: Mettre a jour les données du client dans la base de données
        const client = await prisma.admin.update({
            where: {
                id: clientInput.id,
            },
            data: {
                phone: clientInput.phone,
                        address: clientInput.address,
                user: {
                    update: {
                         firstName: clientInput.firstName,
                         lastName: clientInput.lastName,
                       
                    },
                },
            },
        });

        revalidatePath("/app/(admin)/services/gestion/");
        
        return { success: true, client };
    });
