"use server"

import { adminAction } from "@/lib/safe-action"
import { createClientSchema } from "./client.create.shema"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

export const doCreateClient = adminAction
    .metadata({actionName:"create client"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createClientSchema)
    .action(async ({ clientInput, ctx }) => {
        console.log("Creating client with data:", clientInput);

        if(clientInput.password !== clientInput.confirmPassword){
            throw new Error("les mots de passe ne correspondent pas");
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
            role: "member",
            },
        });
        // TODO: Sauvegarder les données du client dans la base de données


        const client = await prisma.user.update({
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
        

        revalidatePath("/app/(admin)/services/gestion/clients");
        
        return { success: true, client };
    });
