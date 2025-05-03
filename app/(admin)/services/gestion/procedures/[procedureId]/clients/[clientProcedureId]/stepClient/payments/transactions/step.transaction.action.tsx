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

          // verifffier l'autorisation de l'utilisateur
          if(!ctx.user.userDetails?.authorize?.canEditTransaction){
            throw new Error("Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }
        
        // Vérifier si une transaction existe déjà pour ce clientStep
        const existingTransaction = await prisma.transaction.findFirst({
            where: {
                clientStepId: clientInput.clientStepId,
                organizationId: ctx.user.userDetails?.organizationId ?? "",
                status: {
                    in: ["PENDING"]
                }
            },
        });

        if (existingTransaction) {
            throw new Error("Une transaction existe déjà pour cette étape client");
        }

        const clientStep = await prisma.clientStep.findUnique({
            where: {
                id: clientInput.clientStepId,
            },
        });

        if (!clientStep) {
            throw new Error("ce module n'existe pas");
        }

        const organization = await prisma.organization.findUnique({
            where: {
                id: ctx.user.userDetails?.organizationId ?? "",
            },
            select: {
                id: true,
            }, 
        });

        if (!organization) {
            throw new Error("Vous n'etes pas autorisé");
        }
        const numberTransaction = await prisma.transaction.count({
            where: {
                clientStepId: clientInput.clientStepId,
                organizationId: ctx.user.userDetails?.organizationId ?? "",
                status: {
                    in: ["PENDING"]
                }
            },
        });
        const reference = (ctx?.user.userDetails.organization?.comptaSettings?.invoicePrefix ?? "FTX-") +  ctx?.user?.userDetails?.organization?.comptaSettings?.invoiceNumberFormat
                ?.replaceAll("{YEAR}", new Date().getFullYear().toString())
                ?.replaceAll("{MONTH}", (new Date().getMonth() + 1).toString().padStart(2, "0"))
                ?.replaceAll("{DAY}", new Date().getDate().toString().padStart(2, "0"))
                ?.replaceAll("{NUM}", (numberTransaction + 1).toString()) + Math.floor(Math.random() * 1000).toString().padStart(3, "0"); 
      
        
        await prisma.transaction.create({
            data: {
                amount: clientInput.amount,
                reference: reference,
                type: "REVENUE",
                status: clientInput.status as TransactionStatus,
                clientStepId: clientStep.id,
                paymentMethod: clientInput.paymentMethod as PaymentMethod,
                description: "Client payment",
                date: new Date(),
                clientProcedureId: clientStep.clientProcedureId,
                organizationId: organization.id,
                approvedById: clientInput.status === "APPROVED" ? ctx.user.userDetails?.id : undefined,
                approvedAt: clientInput.status === "APPROVED" ? new Date(Date.now()) : undefined,
                createdById: ctx.user.userDetails?.id ?? "",
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
                approvedById:ctx.user.userDetails?.id ?? "",
                approvedAt: new Date(Date.now()),
            },
        });

        revalidatePath("/app/(admin)/services/gestion/Procedures");

        return { success: true };
    });
