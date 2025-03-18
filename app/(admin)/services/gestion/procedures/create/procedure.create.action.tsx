"use server"

import { adminAction } from "@/lib/safe-action"
import { createProcedureScheme } from "./procedure.create.sheme"
import prisma from "@/db/prisma";

import { revalidatePath } from "next/cache";

export const doCreateProcedure = adminAction
    .metadata({actionName:"create Procedure"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createProcedureScheme)
    .action(async ({ clientInput }) => {
        console.log("Creating Procedure with data:", clientInput);

        const procedure = await prisma.procedure.create({
            data: {
                name: clientInput.name,
                description: "",
            },
        });

        // create category for the procedure
        await prisma.category.create({
            data: {
                name: clientInput.name,
                type: "REVENUE",
                description: "Categorie de transaction pour la procedure : " + clientInput.name,
            },
        });

        revalidatePath("/app/(admin)/services/gestion/Procedures");
        
        return { success: true, procedure };
    });
