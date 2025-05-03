

"use server";

import { adminAction } from "@/lib/safe-action"


import { revalidatePath } from "next/cache";
import { createExpenseSchema } from "./depense.shema";
import prisma from "@/db/prisma";
import { PaymentMethod,  } from "@prisma/client";

export const doCreateDepense = adminAction
    .metadata({actionName:"create Depense"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createExpenseSchema)
    .action(async ({ clientInput,ctx }) => {
        console.log("Creating Procedure with data:", clientInput);

        if (!ctx.user.userDetails?.authorize?.canCreateExpense) {
            throw new Error("Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }
        
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
       const numberTransaction = await prisma.transaction.count({
            where: {
                organizationId: ctx.user.userDetails?.organizationId ?? "",
                type: "EXPENSE",
            },
        });
            
        const reference = (ctx?.user.userDetails.organization?.comptaSettings?.invoicePrefix ?? "FTX-") +  ctx?.user?.userDetails?.organization?.comptaSettings?.invoiceNumberFormat
        ?.replaceAll("{YEAR}", new Date().getFullYear().toString())
        ?.replaceAll("{MONTH}", (new Date().getMonth() + 1).toString().padStart(2, "0"))
        ?.replaceAll("{DAY}", new Date().getDate().toString().padStart(2, "0"))
        ?.replaceAll("{NUM}", (numberTransaction + 1).toString()) + Math.floor(Math.random() * 1000).toString().padStart(3, "0");

        console.log("reference", reference);
        // create Depense
        await prisma.transaction.create({
            data: {
                amount: clientInput.amount,
                reference: reference,
                type: "EXPENSE",
                status: clientInput.status,
                paymentMethod: clientInput.paymentMethod as PaymentMethod,
                description: "" + clientInput.description,
                date: new Date(),
                approvedAt: clientInput.status === "APPROVED" ? new Date(Date.now()) : undefined,
                createdById: ctx.user.userDetails?.id ?? "",
                organizationId: ctx.user.userDetails?.organizationId ?? "",
                expense: {
                    create: {
                       vendor: clientInput.vendor,
                       title: clientInput.title,
                       description: clientInput.description,
                       dueDate: clientInput.dueDate ? new Date(clientInput.dueDate) : new Date(Date.now()),
                       organizationId: ctx.user.userDetails?.organizationId ?? "",
                       createdById: ctx.user.userDetails?.id ?? "",
                    },
                },
            },
        });

        revalidatePath("/app/(admin)/services/gestion/depenses");
        
        return { success: true };
    });


