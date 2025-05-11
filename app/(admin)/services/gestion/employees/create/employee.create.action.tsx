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
               // verifiier s'il est authorisé
            if (ctx.user.userDetails?.authorize?.canCreateAdmin === false) {
                throw new Error("Vous n'êtes pas autorisé à créer cet utilisateur");
            }
            // Validate password match
            if (clientInput.password !== clientInput.confirmPassword) {
                throw new Error("Les mots de passe ne correspondent pas");
            }

            // Check if client already exists
            const existingClient = await prisma.user.findFirst({
                where: {
                    email: clientInput.email,
                    admin: {
                        isNot: null
                    }
                }
            });

            if (existingClient) {
                throw new Error("Un client avec cet email existe déjà");
            }

            // Create user account
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

            // Get organization
            const organization = await prisma.organization.findFirst({
                where: {
                    id: ctx.user.userDetails?.organization?.id,
                },
            });

            if (!organization) {
                throw new Error("Organisation introuvable");
            }

            // Create client profile
            await prisma.user.update({
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

            await prisma.authorization.create({
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
                    canEditStep:true,
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

            await sendEmail({
                to: ctx.user.userDetails?.email ?? "",
                subject: `Ajout d'un client sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
               html: generateEmailMessageHtml({
                  subject: `Ajout d'un client sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
                  content:  
                    `
                    <p>Bonjour</p>
                    <p>${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName} a ajouté ${clientInput.email} comme client.</p>
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
                subject: `Ajout d'un client sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
               html: generateEmailMessageHtml({
                  subject: `Ajout d'un admin/employée sur ProGestion ${ctx.user.userDetails?.organization?.name}`,
                  content:  
                    `
                    <p>Bonjour</p>
                    <p>${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName} a ajouté ${clientInput.email} comme employée/admin.</p>
                    
                   `
                })
              });

            revalidatePath("/app/(admin)/services/gestion/employees");
            
            return { success: true };
        } catch (error) {
            console.error("Error creating client:", error);
            throw error;
        }
    });



  