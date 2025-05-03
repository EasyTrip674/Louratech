"use server"

import { adminAction } from "@/lib/safe-action"
import { createProcedureScheme } from "./procedure.create.sheme"
import prisma from "@/db/prisma";

import { revalidatePath } from "next/cache";

export const doCreateProcedure = adminAction
    .metadata({actionName:"create Procedure"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createProcedureScheme)
    .action(async ({ clientInput ,ctx}) => {


        console.log("Creating Procedure with data:", clientInput);

        // TODO: Vérifier si l'utilisateur est autorisé à créer une procédure
        if (ctx.user.userDetails?.authorize?.canCreateProcedure === false) {
            throw new Error("Vous n'êtes pas autorisé à créer un service");
        }

        const existProcedure = await prisma.procedure.findFirst({
            where: {
                name: clientInput.name,
                organizationId: ctx.user.userDetails?.organizationId,
            }
        });
        if (existProcedure) {
            throw new Error("Procedure already exist");
        }

        const procedure = await prisma.procedure.create({
            data: {
                name: clientInput.name,
                description: "",
                organizationId: ctx.user.userDetails?.organizationId,
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
