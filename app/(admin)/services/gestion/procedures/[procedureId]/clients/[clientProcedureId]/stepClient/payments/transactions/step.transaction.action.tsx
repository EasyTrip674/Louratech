"use server";

import { adminAction } from "@/lib/safe-action"


import { revalidatePath } from "next/cache";
import { createTransactionSchema } from "./transaction.schema";
import prisma from "@/db/prisma";
import { PaymentMethod, Role, TransactionStatus } from "@prisma/client";
import { z } from "zod";
import { sendEmail } from "@/lib/nodemailer/email";
import { generateEmailMessageHtml } from "@/lib/nodemailer/message";

export const doCreateTransaction = adminAction
    .metadata({actionName:"create Transaction"})
    .schema(createTransactionSchema)
    .action(async ({ clientInput, ctx }) => {
        console.log("Creating Transaction with data:", clientInput);

        // Vérifier l'autorisation de l'utilisateur
        if(!ctx.user.userDetails?.authorize?.canEditTransaction){
            throw new Error("Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }

        // SOLUTION 1: Utiliser une transaction Prisma pour éviter la race condition
        const result = await prisma.$transaction(async (tx) => {
            // Vérifier si une transaction existe déjà (dans la transaction)
            const fiveSecondsAgo = new Date(Date.now() - 15000);
            const recentTransaction = await tx.transaction.findFirst({
                where: {
                    clientStepId: clientInput.clientStepId,
                    organizationId: ctx.user.userDetails?.organizationId ?? "",
                    createdAt: {
                        gte: fiveSecondsAgo // Transactions des 5 dernières secondes
                    }
                },
            });

            if(recentTransaction){
                throw new Error("Une transaction a été créée récemment pour cette étape client");
            }

            const clientStep = await tx.clientStep.findUnique({
                where: {
                    id: clientInput.clientStepId,
                },
            });

            if (!clientStep) {
                throw new Error("ce module n'existe pas");
            }

            const organization = await tx.organization.findUnique({
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

            // Compter dans la même transaction
            const numberTransaction = await tx.transaction.count({
                where: {
                    clientStepId: clientInput.clientStepId,
                    organizationId: ctx.user.userDetails?.organizationId ?? "",
                    status: "PENDING"
                },
            });

            const reference = (ctx?.user.userDetails.organization?.comptaSettings?.invoicePrefix ?? "FTX-") +  
                ctx?.user?.userDetails?.organization?.comptaSettings?.invoiceNumberFormat
                    ?.replaceAll("{YEAR}", new Date().getFullYear().toString())
                    ?.replaceAll("{MONTH}", (new Date().getMonth() + 1).toString().padStart(2, "0"))
                    ?.replaceAll("{DAY}", new Date().getDate().toString().padStart(2, "0"))
                    ?.replaceAll("{NUM}", (numberTransaction + 1).toString()) + 
                Math.floor(Math.random() * 1000).toString().padStart(3, "0"); 

            // Créer la transaction dans la même transaction Prisma
            const transaction = await tx.transaction.create({
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

            return transaction;
        });

        // Envoyer les emails après la transaction (pour éviter de ralentir la transaction)
        try {
            await Promise.all([
                sendEmail({
                    to: ctx.user.userDetails?.email ?? "",
                    subject: `Creation d'un transaction sur ${ctx.user.userDetails?.organization?.name}`,
                    html: generateEmailMessageHtml({
                        subject: `Creation d'un transaction sur ${ctx.user.userDetails?.organization?.name}`,
                        content: `
                            <p>Bonjour</p>
                            <p>Votre transaction a été créé avec succès.</p>
                            <p>Voici les détails de la transaction :</p>
                            <p>Montant : ${result.amount} FNG</p>
                            <p>Référence : ${result.reference}</p>
                            <p> Créé par : ${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName} pour un service de votre agence</p>
                            <p>Date : ${new Date(result.createdAt).toLocaleDateString("fr-FR")}</p>
                            <p>Merci de votre confiance.</p>
                        `
                    })
                }),
                (async () => {
                    const admin = await prisma.user.findFirst({
                        where: {
                            organizationId: ctx.user.userDetails?.organization?.id,
                            role: Role.ADMIN,
                        },
                    });
                    
                    if (admin?.email) {
                        await sendEmail({
                            to: admin.email,
                            subject: `Creation d'un transaction sur ${ctx.user.userDetails?.organization?.name}`,
                            html: generateEmailMessageHtml({
                                subject: `Creation d'un transaction sur ${ctx.user.userDetails?.organization?.name}`,
                                content: `
                                    <p>Bonjour</p>
                                    <p>Votre transaction a été créé avec succès.</p>
                                    <p>Voici les détails de la transaction :</p>
                                    <p>Montant : ${result.amount} FNG</p>
                                    <p>Référence : ${result.reference}</p>
                                    <p> Créé par : ${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName} pour un service de votre agence</p>
                                    <p>Date : ${new Date(result.createdAt).toLocaleDateString("fr-FR")}</p>
                                    <p>Merci de votre confiance.</p>
                                `
                            })
                        });
                    }
                })()
            ]);
        } catch (emailError) {
            console.warn("Erreur lors de l'envoi des emails:", emailError);
            // Ne pas faire échouer la création de transaction si l'email échoue
        }

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

        // Send email to update approval status

        await sendEmail({
            to: ctx.user.userDetails?.email ?? "",
            subject: `Approbation d'un transaction sur ${ctx.user.userDetails?.organization?.name}`,
           html: generateEmailMessageHtml({
              subject: `Approbation d'un transaction sur ${ctx.user.userDetails?.organization?.name}`,
              content:  
                `
                <p>Bonjour</p>
                <p>Votre transaction a été approuvée avec succès.</p>
                <p>Voici les détails de la transaction :</p>
                <p>Montant : ${transaction.amount} FNG</p>
                <p>Référence : ${transaction.reference}</p>
                <p> Approuvée par : ${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName}</p>
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
            subject: `Approbation d'un transaction sur ${ctx.user.userDetails?.organization?.name}`,
           html: generateEmailMessageHtml({
              subject: `Approbation d'un transaction sur ${ctx.user.userDetails?.organization?.name}`,
              content:  
                `
                <p>Bonjour</p>
                <p>Votre transaction a été approuvée avec succès.</p>
                <p>Voici les détails de la transaction :</p>
                <p>Montant : ${transaction.amount} FNG</p>
                <p>Référence : ${transaction.reference}</p>
                <p> Approuvée par : ${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName}</p>
                <p>Date : ${new Date(transaction.createdAt).toLocaleDateString("fr-FR")}</p>
                <p>Merci de votre confiance.</p>
               `
            })
          });


        revalidatePath("/app/(admin)/services/gestion/Procedures");

        return { success: true };
    });
