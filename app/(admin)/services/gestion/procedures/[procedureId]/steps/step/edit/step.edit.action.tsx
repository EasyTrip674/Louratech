"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import {  editStepProcedureSchema } from "./step.edit.shema";

export const doEditStep = adminAction
    .metadata({actionName:"step client"}) // ✅ Ajout des métadonnées obligatoires
    .schema(editStepProcedureSchema)
    .action(async ({ clientInput }) => {
        console.log("Creating step with data:", clientInput);



        // TODO: Sauvegarder les données du step dans la base de données

        const procedure  = await prisma.procedure.findUnique({
            where:{
                id: clientInput.procedureId
            },
            select:{
                id:true
            }
        })
        if(!procedure){
            // throw new Error("Donnees invalides");
            return;
        }
        const step = await prisma.stepProcedure.update({
            where:{
                id: clientInput.stepId
            },
            data:{
                description: clientInput.description ?? "",
                price: clientInput.price,
                name:clientInput.name,
                order:1
            }
        })
     
        

        revalidatePath("/app/(admin)/services/gestion/procedures");
        
        return { success: true, step };
    });
