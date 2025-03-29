"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { createOrganizationSchema } from "./create.organization.shema";
import { authClient } from "@/lib/auth-client";
import { Role } from "@prisma/client";

export const doCreateOrganization = adminAction
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
         const userAuth = await authClient.signUp.email({
            email: clientInput.email,
            password: clientInput.password,
            name: clientInput.firstName + " " + clientInput.lastName,
        });
        if(userAuth.error && userAuth.error.message){
            throw new Error(userAuth.error.message);
        }

        const user = await prisma.user.findUniqueOrThrow({
            where:{
                id: userAuth.data?.user.id
            }
        });

        console.log("User created:", user);

        const userUpdated = await prisma.user.update({
            where:{
                id: user.id
            },
            data:{
                role: Role.ADMIN,
                firstName: clientInput.firstName,
                lastName: clientInput.lastName,
                email: clientInput.email,
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
        
        return { success: true };
    });
