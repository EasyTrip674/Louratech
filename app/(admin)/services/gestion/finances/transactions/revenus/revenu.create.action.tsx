

"use server";

import { adminAction } from "@/lib/safe-action"


import { revalidatePath } from "next/cache";
import { createRevenuSchema } from "./revenu.shema";
import prisma from "@/db/prisma";
import { PaymentMethod, Role,  } from "@prisma/client";
import { sendEmail } from "@/lib/nodemailer/email";
import { generateEmailMessageHtml } from "@/lib/nodemailer/message";

export const doCreateRevenu = adminAction
    .metadata({actionName:"create Revenu"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createRevenuSchema)
    .action(async ({ clientInput,ctx }) => {
        console.log("Creating Procedure with data:", clientInput);

        if (!ctx.user.userDetails?.authorize?.canCreateRevenue) {
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
       
        // create Revenu
       const transaction = await prisma.transaction.create({
            data: {
                amount: clientInput.amount,
                reference:reference,
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


        await sendEmail({
            to: ctx.user.userDetails?.email ?? "",
            subject: `Creation d'un revenu sur ${ctx.user.userDetails?.organization?.name}`,
           html: generateEmailMessageHtml({
              subject: `Creation d'un revenu sur ${ctx.user.userDetails?.organization?.name}`,
              content:  
                `
                <p>Bonjour</p>
                <p>Votre transaction a été créé avec succès.</p>
                <p>Voici les détails de la transaction :</p>
                <p>Montant : ${transaction.amount} FNG</p>
                <p>Référence : ${transaction.reference}</p>
                <p> Créé par : ${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName} pour un service de votre entreprise</p>
                <p>Date : ${new Date(transaction.createdAt).toLocaleDateString("fr-FR")}</p>
                <p>Merci de votre confiance.</p>
               `
            })
          });
          const admin = await prisma.user.findFirst({
            where: {
                organizationId: ctx.user.userDetails?.organization?.id,
                role: Role.ADMIN,
            },
        });
        await sendEmail({
            to: admin?.email ?? "",
            subject: `Creation d'un revenu sur ${ctx.user.userDetails?.organization?.name}`,
           html: generateEmailMessageHtml({
              subject: `Creation d'un revenu sur ${ctx.user.userDetails?.organization?.name}`,
              content:  
                `
                <p>Bonjour</p>
                <p>Votre revenu a été créé avec succès.</p>
                <p>Voici les détails de la revenu :</p>
                <p>Montant : ${transaction.amount} FNG</p>
                <p>Référence : ${transaction.reference}</p>
                <p> Créé par : ${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName} </p>
                <p>Date : ${new Date(transaction.createdAt).toLocaleDateString("fr-FR")}</p>
                <p>Merci de votre confiance.</p>
               `
            })
          });


        revalidatePath("/app/(admin)/services/gestion/finances/transactions/revenus");
        
        return { success: true };
    });


