"use server"

import { adminAction } from "@/lib/safe-action"
import { createClientSchema } from "./client.create.shema"
import { revalidatePath } from "next/cache";
import { clientService } from "@/lib/services";
import { sendEmail } from "@/lib/nodemailer/email";
import { generateEmailMessageHtml } from "@/lib/nodemailer/message";

export const doCreateClient = adminAction
    .metadata({ actionName: "create client" })
    .schema(createClientSchema)
    .action(async ({ clientInput, ctx }) => {
        try {
            // Vérifier s'il est autorisé
            if (ctx.user.userDetails?.authorize?.canCreateClient === false) {
                throw new Error("Vous n'êtes pas autorisé à créer un client");
            }else{

                

                // Utiliser le service client pour créer le client
            const newClient = await clientService.createClient(clientInput);

            // Envoyer les emails APRÈS que la création soit terminée avec succès
            try {
                const organizationName = ctx.user.userDetails?.organization?.name || "ProGestion";
                
                // Email à l'utilisateur actuel
                await sendEmail({
                    to: ctx.user.userDetails?.email ?? "",
                    subject: `Ajout d'un client sur ${organizationName}`,
                    html: generateEmailMessageHtml({
                        subject: `Ajout d'un client sur ${organizationName}`,
                        content: `
                            <p>Bonjour ${ctx.user.userDetails?.firstName} ${ctx.user.userDetails?.lastName},</p>
                            <p>Vous avez ajouté ${clientInput.email} comme client avec succès.</p>
                            <p>Détails du client :</p>
                            <ul>
                                <li>Nom : ${clientInput.firstName} ${clientInput.lastName}</li>
                                <li>Email : ${clientInput.email}</li>
                                <li>Téléphone : ${clientInput.phone || 'Non renseigné'}</li>
                            </ul>
                        `
                    })
                });

        
            } catch (emailError) {
                console.error("Erreur lors de l'envoi des emails:", emailError);
                // Ne pas faire échouer toute l'opération si l'email échoue
            }

            // Revalider le cache
            revalidatePath("/app/(admin)/services/gestion/clients");
            
            return { 
                success: true, 
                client: newClient,
                message: "Client créé avec succès"
            };

            }

            
        }
        catch (error) {
            console.error("Error creating client:", error);
            throw new Error(`Échec de la création du client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    });