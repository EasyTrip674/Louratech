"use server"

import { adminAction } from "@/lib/safe-action"
import { createEmployeeSheme } from "./employee.create.shema"
import prisma from "@/db/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/nodemailer/email";
import { generateEmailMessageHtml } from "@/lib/nodemailer/message";

export const doCreateEmployee = adminAction
    .metadata({actionName:"Employee creation"})
    .schema(createEmployeeSheme)
    .action(async ({ clientInput, ctx }) => {
        try {
            // Vérifier s'il est autorisé
            if (ctx.user.userDetails?.authorize?.canCreateAdmin === false) {
                throw new Error("Vous n'êtes pas autorisé à créer cet utilisateur");
            }

            // Valider la correspondance des mots de passe
            if (clientInput.password !== clientInput.confirmPassword) {
                throw new Error("Les mots de passe ne correspondent pas");
            }

            // Vérifier l'existence de l'employé AVANT de continuer
            const existingEmployee = await prisma.user.findFirst({
                where: {
                    email: clientInput.email,
                    admin: {
                        isNot: null
                    }
                }
            });

            console.log(existingEmployee);

            if (existingEmployee?.id) {
                throw new Error("Un employé avec cet email existe déjà");
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
                        password: clientInput.password,
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

                // Mettre à jour le profil utilisateur
                await tx.user.update({
                    where: {
                        id: user.user.id,
                    },
                    data: {
                        organizationId: organization.id,
                        role: Role.EMPLOYEE,
                        lastName: clientInput.lastName,
                        firstName: clientInput.firstName,
                        admin: {
                            create: {
                                phone: clientInput.phone || "",
                                address: clientInput.address || "",
                                organization: {
                                    connect: {
                                        id: organization.id, 
                                    }
                                }
                            }
                        },
                    },
                });

                // Créer les autorisations
                await tx.authorization.create({
                    data: {
                        userId: user.user.id,
                        // Permissions générales
                        canChangeUserAuthorization: false,
                        canChangeUserPassword: false,
                        
                        // Permissions de création
                        canCreateOrganization: false,
                        canCreateStep: true,
                        canCreateClient: true,
                        canCreateProcedure: true,
                        canCreateTransaction: true,
                        canCreateInvoice: true,
                        canCreateExpense: true,
                        canCreateRevenue: true,
                        canCreateComptaSettings: true,
                        canCreateClientProcedure: true,
                        canCreateClientStep: true,
                        canCreateClientDocument: true,
                        canCreateAdmin: false,
                        
                        // Permissions de lecture
                        canReadOrganization: true,
                        canReadClient: true,
                        canReadStep: true,
                        canReadProcedure: true,
                        canReadTransaction: true,
                        canReadInvoice: true,
                        canReadExpense: true,
                        canReadRevenue: true,
                        canReadComptaSettings: true,
                        canReadClientProcedure: true,
                        canReadClientStep: true,
                        canReadClientDocument: true,
                        canReadAdmin: true,
                        
                        // Permissions de modification
                        canEditOrganization: false,
                        canEditClient: true,
                        canEditStep: true,
                        canEditProcedure: true,
                        canEditTransaction: true,
                        canEditInvoice: true,
                        canEditExpense: true,
                        canEditRevenue: true,
                        canEditComptaSettings: true,
                        canEditClientProcedure: true,
                        canEditClientStep: true,
                        canEditClientDocument: true,
                        canEditAdmin: false,
                        
                        // Permissions de suppression
                        canDeleteOrganization: false,
                        canDeleteClient: true,
                        canDeleteProcedure: true,
                        canDeleteTransaction: true,
                        canDeleteInvoice: true,
                        canDeleteExpense: true,
                        canDeleteRevenue: true,
                        canDeleteComptaSettings: false,
                        canDeleteClientProcedure: true,
                        canDeleteClientStep: true,
                        canDeleteClientDocument: true,
                        canDeleteAdmin: false,
                    }
                });

                return { userId: user.user.id };
            });

            // Envoyer les emails APRÈS que la transaction soit terminée avec succès
            try {
                // Email à l'utilisateur actuel
                await sendEmail({
                    to: ctx.user.userDetails?.email ?? "",
                    subject: `Ajout d'un employé sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
                    html: generateEmailMessageHtml({
                        subject: `Ajout d'un employé sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
                        content: `
                            <p>Bonjour</p>
                            <p>${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName} a ajouté ${clientInput.email} comme employé.</p>
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
                        subject: `Ajout d'un employé sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
                        html: generateEmailMessageHtml({
                            subject: `Ajout d'un employé sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
                            content: `
                                <p>Bonjour</p>
                                <p>${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName} a ajouté ${clientInput.email} comme employé.</p>
                            `
                        })
                    });
                }
            } catch (emailError) {
                console.error("Erreur lors de l'envoi des emails:", emailError);
                // Ne pas faire échouer toute l'opération si l'email échoue
            }

            // Revalider le cache
            revalidatePath("/app/(admin)/services/gestion/employees");
            
            return { success: true };

        } catch (error) {
            console.error("Error creating employee:", error);
            throw error;
        }
    });