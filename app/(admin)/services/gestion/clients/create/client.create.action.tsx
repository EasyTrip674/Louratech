"use server"
import bcrypt from "bcrypt";

import { adminAction } from "@/lib/safe-action"
import { createClientSchema } from "./client.create.shema"
import prisma from "@/db/prisma";
import { Role } from "@prisma/client";

export const doCreateClient = adminAction
    .metadata({actionName:"create client"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createClientSchema)
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


        const client = await prisma.user.create({
            data: {
                firstName: clientInput.firstName,
                lastName: clientInput.lastName,
                password: passwordHash,
                role: "CLIENT" as Role,
                email: clientInput.email,
                organizationId: organization.id,
                client: {
                    create: {
                    phone: clientInput.phone,
                    passport: clientInput.passport,
                    address: clientInput.address,
                    birthDate: clientInput.birthDate ? new Date(clientInput.birthDate) : undefined,
                    fatherLastName: clientInput.fatherLastName,
                    fatherFirstName: clientInput.fatherFirstName,
                    motherLastName: clientInput.motherLastName,
                    motherFirstName: clientInput.motherFirstName,
                    organizationId: organization.id,
                    },
                },
            },
        });
        

    
        
        return { success: true, client };
    });
