"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { createStepProcedureSchema } from "./step.create.shema";

export const doCreateStep = adminAction
    .metadata({actionName:"step client"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createStepProcedureSchema)
    .action(async ({ clientInput ,ctx}) => {
        console.log("Creating step with data:", clientInput);

        const existStep = await prisma.stepProcedure.findFirst({
            where: {
                name: clientInput.name,
                procedureId: clientInput.procedureId,
            }
        });
        if (existStep) {
            throw new Error("Step already exist");
        }

        // TODO: Sauvegarder les données du step dans la base de données

        const procedure  = await prisma.procedure.findUnique({
            where:{
                id: clientInput.procedureId,
                organizationId: ctx.user.userDetails?.organizationId,
            },
            select:{
                id:true
            }
        })
        if(!procedure){
            // throw new Error("Donnees invalides");
            return;
        }
        const step = await prisma.stepProcedure.create({
            data:{
                description: clientInput.description ?? "",
                procedureId: procedure.id,
                price: clientInput.price,
                name:clientInput.name,
                order:1
            }
        })
     
        

        revalidatePath("/app/(admin)/services/gestion/procedures");
        
        return { success: true, step };
    });
