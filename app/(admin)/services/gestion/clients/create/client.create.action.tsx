"use server"

import { adminAction } from "@/lib/safe-action"
import { createClientSchema } from "./client.create.shema"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { sendEmail } from "@/lib/nodemailer/email";
import { generateEmailMessageHtml } from "@/lib/nodemailer/message";

export const doCreateClient = adminAction
    .metadata({ actionName: "create client" })
    .schema(createClientSchema)
    .action(async ({ clientInput, ctx }) => {
        try {
            // Vérifier s'il est autorisé
            if (ctx.user.userDetails?.authorize?.canCreateClient === false) {
                throw new Error("Vous n'êtes pas autorisé à créer cet utilisateur");
            }

            // Vérifier l'existence du client AVANT de continuer
            const existingClient = await prisma.user.findFirst({
                where: {
                    email: clientInput.email,
                    client: {
                        isNot: null
                    }
                }
            });

            if (existingClient) {
                throw new Error("Un client avec cet email existe déjà");
            }

            // Vérifier l'existence de l'organisation AVANT de continuer
            const organization = await prisma.organization.findFirst({
                where: {
                    id: ctx.user.userDetails?.organization?.id,
                },
            });

            if (!organization) {
                throw new Error("Organisation introuvable");
            }

            // Utiliser une transaction pour toutes les opérations de base de données
            await prisma.$transaction(async (tx) => {
                // Créer le compte utilisateur
                const user = await auth.api.signUpEmail({
                    body: {
                        email: clientInput.email,
                        password: "00000000",
                        name: `${clientInput.firstName} ${clientInput.lastName}`,
                        options: {
                            emailVerification: false,
                            data: {
                                firstName: clientInput.firstName,
                                lastName: clientInput.lastName,
                            }
                        }
                    }
                });

                if (!user.user.id) {
                    throw new Error("Erreur lors de la création de l'utilisateur");
                }

                // Créer le profil client
                await tx.user.update({
                    where: {
                        id: user.user.id,
                    },
                    data: {
                        organizationId: organization.id,
                        role: Role.CLIENT,
                        lastName: clientInput.lastName,
                        firstName: clientInput.firstName,
                        client: {
                            create: {
                                phone: clientInput.phone,
                                passport: clientInput.passport,
                                address: clientInput.address,
                                birthDate: clientInput.birthDate ? new Date(clientInput.birthDate) : null,
                                fatherLastName: clientInput.fatherLastName,
                                fatherFirstName: clientInput.fatherFirstName,
                                motherLastName: clientInput.motherLastName,
                                motherFirstName: clientInput.motherFirstName,
                                organizationId: organization.id,
                            },
                        },
                    },
                });

                return { userId: user.user.id };
            });

            // Envoyer les emails APRÈS que la transaction soit terminée avec succès
            try {
                // Email à l'utilisateur actuel
                await sendEmail({
                    to: ctx.user.userDetails?.email ?? "",
                    subject: `Ajout d'un client sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
                    html: generateEmailMessageHtml({
                        subject: `Ajout d'un client sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
                        content: `
                            <p>Bonjour</p>
                            <p>${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName} a ajouté ${clientInput.email} comme client.</p>
                        `
                    })
                });

                // Email à l'admin
                const admin = await prisma.user.findFirst({
                    where: {
                        organizationId: ctx.user.userDetails?.organization?.id,
                        role: Role.ADMIN,
                    },
                });

                if (admin?.email) {
                    await sendEmail({
                        to: admin.email,
                        subject: `Ajout d'un client sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
                        html: generateEmailMessageHtml({
                            subject: `Ajout d'un client sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
                            content: `
                                <p>Bonjour</p>
                                <p>${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName} a ajouté ${clientInput.email} comme client.</p>
                            `
                        })
                    });
                }
            } catch (emailError) {
                console.error("Erreur lors de l'envoi des emails:", emailError);
                // Ne pas faire échouer toute l'opération si l'email échoue
            }

            // Revalider le cache
            revalidatePath("/app/(admin)/services/gestion/clients");
            
            return { success: true };

        } catch (error) {
            console.error("Error creating client:", error);
            throw error;
        }
    });