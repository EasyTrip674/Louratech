"use server"

import { actionClient } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { createOrganizationSchema } from "./create.organization.shema";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const doCreateOrganization = actionClient
    .metadata({actionName:"create organization"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createOrganizationSchema)
    .action(async ({ clientInput }) => {

        if(clientInput.password !== clientInput.confirmPassword){
            throw new Error("Passwords do not match");
        }

        if (clientInput.agreesToTerms === false) {
            throw new Error("You must agree to the terms and conditions");
        }

        // create slug based on organization name
        const slug = clientInput.organizationName.toLowerCase().replace(/ /g, "-");
        const existUser = await prisma.user.findFirst({
            where:{
                email: clientInput.email
            }
        });

        if(existUser){
            throw new Error("User already exist");
        }
         // create user admin for the organization
         const userAuth = await auth.api.signUpEmail({
         body: {
            email: clientInput.email,
            password: clientInput.password,
            name: clientInput.firstName + " " + clientInput.lastName,
            options: {
                emailVerification: false,
                data: {
                    firstName: clientInput.firstName,
                    lastName: clientInput.lastName,
                }
              }
            }
        });
        
        if(!userAuth.user){
            throw new Error("User already exist");
        }

        const user = await prisma.user.findUniqueOrThrow({
            where:{
                id: userAuth.user.id
            }
        });

        // console.log("User created:", user);

        const userUpdated = await prisma.user.update({
            where:{
                id: user.id
            },
            data:{
                role: Role.ADMIN,
                firstName: clientInput.firstName,
                lastName: clientInput.lastName,
                email: clientInput.email,
                authorize:{
                    create:{
                        // Permissions générales
                        canChangeUserAuthorization: true,
                        canChangeUserPassword: true,

                        // Permissions de création
                        canCreateOrganization: false,
                        canCreateClient: true,
                        canCreateProcedure: true,
                        canCreateTransaction: true,
                        canCreateInvoice: true,
                        canCreateExpense: true,
                        canCreateRevenue: true,
                        canCreateComptaSettings: true,
                        canCreateTeam: true,
                        canCreateMember: true,
                        canCreateInvitation: true,
                        canCreateClientProcedure: true,
                        canCreateClientStep: true,
                        canCreateClientDocument: true,
                        canCreateAdmin: true,

                        // Permissions de lecture
                        canReadOrganization: true,
                        canReadClient: true,
                        canReadProcedure: true,
                        canReadTransaction: true,
                        canReadInvoice: true,
                        canReadExpense: true,
                        canReadRevenue: true,
                        canReadComptaSettings: true,
                        canReadTeam: true,
                        canReadMember: true,
                        canReadInvitation: true,
                        canReadClientProcedure: true,
                        canReadClientStep: true,
                        canReadClientDocument: true,
                        canReadAdmin: true,

                        // Permissions de modification
                        canEditOrganization: true,
                        canEditClient: true,
                        canEditProcedure: true,
                        canEditTransaction: true,
                        canEditInvoice: true,
                        canEditExpense: true,
                        canEditRevenue: true,
                        canEditComptaSettings: true,
                        canEditTeam: true,
                        canEditMember: true,
                        canEditInvitation: true,
                        canEditClientProcedure: true,
                        canEditClientStep: true,
                        canEditClientDocument: true,
                        canEditAdmin: true,

                        // Permissions de suppression
                        canDeleteOrganization: true,
                        canDeleteClient: true,
                        canDeleteProcedure: true,
                        canDeleteTransaction: true,
                        canDeleteInvoice: true,
                        canDeleteExpense: true,
                        canDeleteRevenue: true,
                        canDeleteComptaSettings: true,
                        canDeleteTeam: true,
                        canDeleteMember: true,
                        canDeleteInvitation: true,
                        canDeleteClientProcedure: true,
                        canDeleteClientStep: true,
                        canDeleteClientDocument: true,
                        canDeleteAdmin: true,
                    }
                }
            }
        });

        const organization = await prisma.organization.create({
            data:{
                name: clientInput.organizationName,
                description: clientInput.organizationDescription,
                slug: slug,
                logo:'',
                metadata:'',
                users:{
                   connect:{
                          id: userUpdated.id
                   }
                },
                member:{
                    create:{
                        user:{
                            connect:{
                                id: userUpdated.id
                            }
                        },
                        role: Role.ADMIN
                        
                },
              
            }
        }
        });


        
        
        console.log("Creating organization with data:", organization);

        revalidatePath("/app/auth/organization");

        redirect("/auth/signin");
        
        return { success: true };
    });
