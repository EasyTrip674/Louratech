"use server"

import { adminAction } from "@/lib/safe-action"
import { createClientSchema } from "./client.create.shema"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

export const doCreateClient = adminAction
    .metadata({ actionName: "create client" })
    .schema(createClientSchema)
    .action(async ({ clientInput, ctx }) => {
        try {
            // Validate password match
            if (clientInput.password !== clientInput.confirmPassword) {
                throw new Error("Les mots de passe ne correspondent pas");
            }

            // Check if client already exists
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

            revalidatePath("/app/(admin)/services/gestion/clients");
            
            return { success: true };
        } catch (error) {
            console.error("Error creating client:", error);
            throw error;
        }
    });
