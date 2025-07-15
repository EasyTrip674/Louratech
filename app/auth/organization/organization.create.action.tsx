"use server"

import { actionClient } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { createOrganizationSchema } from "./create.organization.shema";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/nodemailer/email";
import { generateEmailMessageHtml } from "@/lib/nodemailer/message";

// Map to track last execution time for each user email
const lastExecutionMap = new Map();

export const doCreateOrganization = actionClient
    .metadata({actionName:"create organization"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createOrganizationSchema)
    .action(async ({ clientInput }) => {
        // Debounce implementation: prevent multiple executions within 3 seconds
        const currentTime = Date.now();
        const userEmail = clientInput.email;
        const codes = ["LouraFlash01", "louraAlpha02", "monAgenceLoura01"]; // Liste des codes d'invitation valides
        const isValidCode = codes.includes(clientInput.invitationCode); // Vérification du code d'invitation
        if (!isValidCode) {
            throw new Error("code invalide");
        }
        // verify d'abord si le code d'invitation est valide

        if (lastExecutionMap.has(userEmail)) {
            const lastTime = lastExecutionMap.get(userEmail);
            const timeDiff = currentTime - lastTime;
            
            // If less than 5 seconds have passed since last execution
            if (timeDiff < 5000) {
                console.log(`Request throttled for ${userEmail}. Time since last request: ${timeDiff}ms`);
                throw new Error("Please wait before submitting again");
            }
        }

        
        // Update the last execution time for this user
        lastExecutionMap.set(userEmail, currentTime);
        
        // Set a timeout to remove the entry after 3 seconds to prevent memory leaks
        setTimeout(() => {
            lastExecutionMap.delete(userEmail);
        }, 3000);

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

        if(!existUser){
            
       


        
        // create user admin for the organization
        const userAuth = await auth.api.signUpEmail({
            body: {
                email: clientInput.email,
                password: clientInput.password,
                name: clientInput.firstName + " " + clientInput.lastName,
            }
        });

        console.log("B en cours....");

        
        if(!userAuth.user){
            throw new Error("User already exist");
        }

        // Wrap all database operations in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUniqueOrThrow({
                where:{
                    id: userAuth.user.id
                }
            });
            
            
            const userUpdated = await tx.user.update({
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
                            canCreateAdmin: true,

                            // Permissions de lecture
                            canReadOrganization: true,
                            canReadStep: true,
                            canReadClient: true,
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
                            canEditOrganization: true,
                            canEditStep: true,
                            canEditClient: true,
                            canEditProcedure: true,
                            canEditTransaction: true,
                            canEditInvoice: true,
                            canEditExpense: true,
                            canEditRevenue: true,
                            canEditComptaSettings: true,
                            canEditClientProcedure: true,
                            canEditClientStep: true,
                            canEditClientDocument: true,
                            canEditAdmin: true,

                            // Permissions de suppression
                            canDeleteOrganization: true,
                            canDeleteStep: true,
                            canDeleteClient: true,
                            canDeleteProcedure: true,
                            canDeleteTransaction: true,
                            canDeleteInvoice: true,
                            canDeleteExpense: true,
                            canDeleteRevenue: true,
                            canDeleteComptaSettings: true,
                            canDeleteClientProcedure: true,
                            canDeleteClientStep: true,
                            canDeleteClientDocument: true,
                            canDeleteAdmin: true,
                        }
                    }
                }
            });

            const organization = await tx.organization.create({
                data:{
                    name: clientInput.organizationName,
                    description: clientInput.organizationDescription,
                    slug: slug,
                    logo:'',
                    metadata:'',
                    active: true,
                    users:{
                        connect:{
                            id: userUpdated.id
                        }
                    },
                  
                }
            });


        // create a organization settings
        await tx.comptaSettings.create({
            data:{
                organization:{
                    connect:organization
                },
                invoiceNumberFormat: "{YEAR}{MONTH}{NUM}",
                invoicePrefix: "FACT-",
                taxIdentification: "",
                defaultTaxRate: 0,
                fiscalYear: new Date(Date.now()),
                currency: "FNG"
            }
        })


            return { userUpdated, organization };
        });

    

        console.log("Creating organization with data:", result.organization);

        // Send email to the user
        await sendEmail({
            to: clientInput.email,
            subject: "Inscription réussie sur ProGestion",
           html: generateEmailMessageHtml({
              subject: "Bienvenue sur ProGestion",
              content: 
                `
                <h1>Bienvenue sur ProGestion</h1>
                <p>Bonjour ${clientInput.organizationName},</p>
                <p>Merci de vous être inscrit sur ProGestion. Votre organisation a été créée avec succès.</p>
                <p>Voici les détails de votre organisation :</p>
                <ul>
                    <li>Nom de l'organisation : ${clientInput.organizationName}</li>
                    <li>Description : ${clientInput.organizationDescription}</li>
                    <li>Nom de l'administrateur : ${clientInput.firstName} ${clientInput.lastName}</li>
                    <li>Email : ${clientInput.email}</li>
                </ul>
                <p>Vous pouvez vous connecter à votre compte en utilisant le lien suivant : <a href="https://www.monagence.org/auth/signin">Se connecter</a></p>
                <p>Nous vous remercions de votre confiance et sommes ravis de vous accueillir parmi nous.</p>
                `
            })
          });

        revalidatePath("/app/auth/organization");

        redirect("/auth/signin");
        
        }else{
            console.log(existUser);
            
            throw new Error("User already exist");
        }
    });


