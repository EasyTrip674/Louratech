"use server"

import { adminAction } from "@/lib/safe-action"
import { editProcedureScheme } from "./procedure.edit.sheme"
import prisma from "@/db/prisma";

import { revalidatePath } from "next/cache";

export const doEditProcedure = adminAction
    .metadata({actionName:"create Procedure"}) // ✅ Ajout des métadonnées obligatoires
    .schema(editProcedureScheme)
    .action(async ({ clientInput ,ctx}) => {


        console.log("Creating Procedure with data:", clientInput);

        // TODO: Vérifier si l'utilisateur est autorisé à créer une procédure
        if (ctx.user.userDetails?.authorize?.canEditProcedure === false) {
            throw new Error("Vous n'êtes pas autorisé à créer un service");
        }

        const existProcedure = await prisma.procedure.findUnique({
            where: {
                id: clientInput.procedureId,
            }
        });
        if (!existProcedure) {
            throw new Error("Procedure already exist");
        }

        const procedure = await prisma.procedure.update({
            where: {
                id: clientInput.procedureId,
            },
            data: {
                name: clientInput.name,
                description: clientInput.description,
            },
        });
        

        // create category for the procedure
        await prisma.category.create({
            data: {
                name: clientInput.name,
                type: "REVENUE",
                description: "Categorie de transaction pour la procedure : " + clientInput.name,
                organizationId: ctx.user.userDetails?.organizationId,
            },
        });

        revalidatePath("/app/(admin)/services/gestion/Procedures");
        
        return { success: true, procedure };
    });
