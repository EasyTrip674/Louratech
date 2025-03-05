"use server"
import bcrypt from "bcrypt";

import { adminAction } from "@/lib/safe-action"
import { createEmployeeSheme } from "./employee.create.shema"
import prisma from "@/db/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const doCreateEmployee = adminAction
    .metadata({actionName:"Employee client"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createEmployeeSheme)
    .action(async ({ clientInput }) => {
        console.log("Creating client with data:", clientInput);

        const passwordHash = await bcrypt.hash(clientInput.password, 10);

        if (!passwordHash) {
            throw new Error("Failed to hash password");
        }

        const organization = await prisma.organization.findFirst({ });
        if (!organization) {
            throw new Error("Organization not found");
        }

        // TODO: Sauvegarder les données du client dans la base de données

        const employee = await prisma.user.create({
            data: {
                email: clientInput.email,
                firstName: clientInput.firstName,
                lastName: clientInput.lastName,
                password: passwordHash,
                role: Role.CLIENT,
                organization: {
                    connect: {
                        id: organization.id,
                    },
                },
                admin: {
                    create: {
                        phone: clientInput.phone || "",
                        address: clientInput.address || "", 
                        organization: {
                            connect: {
                                id: organization.id,
                            },
                        },
                    },
            },
        }});
        

        revalidatePath("/app/(admin)/services/gestion/clients");
        
        return { success: true, employee };
    });
