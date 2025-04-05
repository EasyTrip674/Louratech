"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { addClientToStepSchema } from "./client.add.to.step.scheme";

export const doAddClientToStep = adminAction
    .metadata({actionName:"add client to stepp"}) // ✅ Ajout des métadonnées obligatoires
    .schema(addClientToStepSchema)
    .action(async ({ clientInput,ctx }) => {

        const organization = await prisma.organization.findUnique({
            where: {
                id: ctx.user.userDetails?.organizationId ?? "",
            },
            select: {
                id: true,
            },
         });
        if (!organization) {
            throw new Error("Organization not found");
        }
        const existCLientStep = await prisma.clientStep.findFirst({
            where:{
                status: {
                    in: ["PENDING", "IN_PROGRESS", "COMPLETED", "WAITING"]
                },
                stepId: clientInput.stepId,
                clientProcedure:{
                    client:{
                        id: clientInput.clientId,
                        organizationId: organization.id
                    }
                }
            }
        });
        if(existCLientStep){
            throw new Error("Client step already exist");
        }
        
        const client = await prisma.client.findUniqueOrThrow({
           where:{
             id:clientInput.clientId
           }
        });

        let clientProcedure= await prisma.clientProcedure.findFirst({
            where:{
                procedureId:clientInput.procedureId,
                clientId:client.id,
                organizationId: organization.id
            }
        })

        if(!clientProcedure){
            clientProcedure = await prisma.clientProcedure.create({
                data:{
                    procedureId:clientInput.procedureId,
                    clientId: client.id,
                    organizationId: organization.id
                }
            })
           
        }

         const clientStep = await prisma.clientStep.create({
            
                data:{
                    clientProcedureId:clientProcedure.id,
                    stepId:clientInput.stepId,
                    price: clientInput.price,
                    status: "PENDING",
                  //TODO:   processedById:
                   processedById: ctx.user.userDetails?.id,
                }
            })



        revalidatePath("/app/(admin)/services/gestion/");
        
        return { success: true, clientStep };
    });
