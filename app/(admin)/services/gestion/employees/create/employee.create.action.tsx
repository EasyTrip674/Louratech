"use server"

import { adminAction } from "@/lib/safe-action"
import { createEmployeeSheme } from "./employee.create.shema"
import prisma from "@/db/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export const doCreateEmployee = adminAction
    .metadata({actionName:"Employee client"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createEmployeeSheme)
    .action(async ({ clientInput,ctx }) => {
        console.log("Creating client with data:", clientInput);

        if(clientInput.password !== clientInput.confirmPassword){
            throw new Error("Passwords do not match");
        }

        const user = await auth.api.signUpEmail({

            body: {
                email: clientInput.email,
                password: clientInput.password,
                name: clientInput.firstName + " " + clientInput.lastName,
            },
            });

        if (!user.user.id) {
            throw new Error("Erreur lors de la création de l'utilisateur");
        }

        const organization = await prisma.organization.findFirst({
            where: {
                id: ctx.user.userDetails?.organization?.id,
            },
        });

        if (!organization) {
            throw new Error("Organisation introuvable");
        }

        await auth.api.addMember({
            body: {
                organizationId: organization.id,
                userId: user.user.id,
                role: Role.EMPLOYEE,
            },
        });

        const admin = await prisma.user.update({
            where: {
                id: user.user.id,
            },
            data: {
                organizationId: organization.id,
                role: Role.ADMIN,
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
                }
            },
        });

      
        revalidatePath("/app/(admin)/services/gestion/clients");
        
        return { success: true, admin };
    });
