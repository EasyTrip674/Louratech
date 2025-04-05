"use server";

import { adminAction } from "@/lib/safe-action"


import { revalidatePath } from "next/cache";
import { createTransactionSchema } from "./transaction.schema";
import prisma from "@/db/prisma";
import { PaymentMethod, TransactionStatus } from "@prisma/client";
import { z } from "zod";

export const doCreateTransaction = adminAction
    .metadata({actionName:"create Transaction"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createTransactionSchema)
    .action(async ({ clientInput,ctx }) => {
        console.log("Creating Procedure with data:", clientInput);


        // TODO: a modifier
        const clientStep = await prisma.clientStep.findUnique({
            where: {
                id: clientInput.clientStepId,
            },
        });

        if (!clientStep) {
            throw new Error("Client step not found");
        }

        console.log(clientStep);

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

        const user = await prisma.user.findFirst({
            
        });

        if (!user) {
            throw new Error("User not found");
        }

        // create transaction
        await prisma.transaction.create({
            data: {
                amount: clientInput.amount,
                type: "REVENUE",
                status: clientInput.status as TransactionStatus,
                clientStepId: clientStep.id,
                paymentMethod: clientInput.paymentMethod as PaymentMethod,
                description: "Client payment",
                date: new Date(),
                clientProcedureId: clientStep.clientProcedureId,
                organizationId: organization.id,
                createdById: user.id,
                revenue: {
                    create: {
                        source: "CLIENT",
                    }
                }
            },
        });

        revalidatePath("/app/(admin)/services/gestion/Procedures");
        
        return { success: true };
    });



// approve transaction action change status to APPROVED

export const doApproveTransaction = adminAction
    .metadata({actionName:"approve Transaction"}) // ✅ Ajout des métadonnées obligatoires
    .schema(z.object({
        transactionId: z.string(),
    }))
    .action(async ({ clientInput,ctx }) => {
        console.log("Approve Transaction with data:", clientInput);

        const transaction = await prisma.transaction.findUnique({
            where: {
                id: clientInput.transactionId,
                organizationId: ctx.user.userDetails?.organizationId ?? "",
            },
        });

        if (!transaction) {
            throw new Error("Transaction not found");
        }

        console.log(transaction);

        await prisma.transaction.update({
            where: {
                id: transaction.id,
                organizationId: ctx.user.userDetails?.organizationId ?? "",
            },
            data: {
                status: "APPROVED",
            },
        });

        revalidatePath("/app/(admin)/services/gestion/Procedures");

        return { success: true };
    });
