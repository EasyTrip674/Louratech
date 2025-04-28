

"use server";

import { adminAction } from "@/lib/safe-action"


import { revalidatePath } from "next/cache";
import { createRevenuSchema } from "./revenu.shema";
import prisma from "@/db/prisma";
import { PaymentMethod,  } from "@prisma/client";

export const doCreateRevenu = adminAction
    .metadata({actionName:"create Revenu"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createRevenuSchema)
    .action(async ({ clientInput,ctx }) => {
        console.log("Creating Procedure with data:", clientInput);
        
    //   verifier si une transaction existe creer le 5 secondes avant
        const existingTransaction = await prisma.transaction.findFirst({
            where: {
                organizationId: ctx.user.userDetails?.organizationId ?? "",
                createdAt: {
                    gte: new Date(Date.now() - 5 * 1000), // 5 seconds ago
                }
            },
        });
        if (existingTransaction) {
            throw new Error("Une transaction existe déjà pour cette étape client");
        }
       
       
        // create Revenu
        await prisma.transaction.create({
            data: {
                amount: clientInput.amount,
                reference:
                    "TRX-" +
                    new Date().getTime() +
                    "-" +
                    Math.floor(Math.random() * 1000),
                type: "REVENUE",
                status: clientInput.status,
                paymentMethod: clientInput.paymentMethod as PaymentMethod,
                description: "" + clientInput.description,
                date: new Date(),
                approvedAt: clientInput.status === "APPROVED" ? new Date(Date.now()) : undefined,
                createdById: ctx.user.userDetails?.id ?? "",
                organizationId: ctx.user.userDetails?.organizationId ?? "",
                revenue: {
                    create: {
                        source: clientInput.title +" | "+ clientInput.source ,
                       organizationId: ctx.user.userDetails?.organizationId ?? "",
                       createdById: ctx.user.userDetails?.id ?? "",
                    },
                },
            },
        });

        revalidatePath("/app/(admin)/services/gestion/finances/transactions/revenus");
        
        return { success: true };
    });


