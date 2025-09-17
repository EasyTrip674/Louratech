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
import { z } from "zod";

// Rate limiting with Redis-like behavior (in-memory for now)
class RateLimiter {
    private static attempts = new Map<string, { count: number; resetTime: number }>();
    private static readonly MAX_ATTEMPTS = 3;
    private static readonly WINDOW_MS = 300000; // 5 minutes

    static check(identifier: string): boolean {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier);

        if (!userAttempts || now > userAttempts.resetTime) {
            this.attempts.set(identifier, { count: 1, resetTime: now + this.WINDOW_MS });
            return true;
        }

        if (userAttempts.count >= this.MAX_ATTEMPTS) {
            return false;
        }

        userAttempts.count++;
        return true;
    }

    static reset(identifier: string): void {
        this.attempts.delete(identifier);
    }
}

// Validation des codes d'invitation avec environnement
const VALID_INVITATION_CODES = process.env.INVITATION_CODES?.split(',') || 
    ["LouraFlash01", "louraAlpha02", "monentrepriseLoura01"];

// Schema de validation étendu

export const doCreateOrganization = actionClient
    .metadata({ actionName: "create organization" })
    .schema(createOrganizationSchema)
    .action(async ({ clientInput }) => {
        try {
            // 1. Rate limiting
            if (!RateLimiter.check(clientInput.email)) {
                throw new Error("Trop de tentatives. Veuillez attendre 5 minutes.");
            }

            // 2. Validation du code d'invitation
            // if (!VALID_INVITATION_CODES.includes(clientInput.invitationCode)) {
            //     throw new Error("Code d'invitation invalide");
            // }

            // 3. Génération du slug unique
            const baseSlug = clientInput.organizationName
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();

                  // Créer l'utilisateur avec Better Auth (le hachage scrypt est géré automatiquement)
                const userAuth = await auth.api.signUpEmail({
                    body: {
                        email: clientInput.email,
                        password: clientInput.password,
                        name: `${clientInput.firstName} ${clientInput.lastName}`,
                    }
                });

                if (!userAuth.user) {
                    throw new Error("Échec de la création de l'utilisateur");
                }

            // 4. Transaction principale avec vérifications atomiques
            const result = await prisma.$transaction(async (tx) => {
                // Vérifier l'existence de l'utilisateur
                const existingUser = await tx.user.findUnique({
                    where: { email: clientInput.email },
                    select: { id: true, email: true }
                });

                if (existingUser) {
                    throw new Error("Un utilisateur avec cet email existe déjà");
                }

                // Générer un slug unique
                let slug = baseSlug;
                let counter = 1;
                while (await tx.organization.findFirst({ where: { slug } })) {
                    slug = `${baseSlug}-${counter}`;
                    counter++;
                }
              

                // Mettre à jour l'utilisateur avec les informations complètes
                const updatedUser = await tx.user.update({
                    where: { id: userAuth.user.id },
                    data: {
                        role: Role.ADMIN,
                        firstName: clientInput.firstName,
                        lastName: clientInput.lastName,
                        authorize: {
                            create: {
                                // Permissions administrateur complètes
                                ...generateAdminPermissions()
                            }
                        }
                    },
                    include: {
                        authorize: true
                    }
                });

                // Créer l'organisation
                const organization = await tx.organization.create({
                    data: {
                        name: clientInput.organizationName,
                        description: clientInput.organizationDescription || "",
                        slug,
                        logo: "",
                        metadata: JSON.stringify({
                            createdBy: updatedUser.id,
                            createdAt: new Date().toISOString(),
                            // invitationCode: clientInput.invitationCode
                        }),
                        active: true,
                        users: {
                            connect: { id: updatedUser.id }
                        }
                    },
                    include: {
                        users: true
                    }
                });

                // Créer les paramètres comptables par défaut
                const comptaSettings = await tx.comptaSettings.create({
                    data: {
                        organizationId: organization.id,
                        invoiceNumberFormat: "{YEAR}{MONTH}{NUM}",
                        invoicePrefix: "FACT-",
                        taxIdentification: "",
                        defaultTaxRate: 0,
                        fiscalYear: new Date(),
                        currency: "FNG"
                    }
                });

                return { 
                    user: updatedUser, 
                    organization, 
                    comptaSettings 
                };
            }, {
                maxWait: 5000, // 5 secondes max d'attente
                timeout: 10000, // 10 secondes de timeout
                isolationLevel: 'Serializable' // Isolation maximale
            });

            // 5. Envoi de l'email de bienvenue (en dehors de la transaction)
            try {
                await sendWelcomeEmail(clientInput, result.organization);
            } catch (emailError) {
                console.error("Erreur lors de l'envoi de l'email:", emailError);
                // Ne pas faire échouer la création pour un problème d'email
            }

            // 6. Reset du rate limiting en cas de succès
            RateLimiter.reset(clientInput.email);

            // 7. Revalidation et redirection
            revalidatePath("/app/auth/organization");
            revalidatePath("/auth/signin");

            redirect("/auth/signin");

        } catch (error) {
            console.error("Erreur lors de la création de l'organisation:", error);
            
            // Gestion des erreurs spécifiques
            if (error instanceof Error) {
                throw error;
            }
            
            throw new Error("Une erreur inattendue s'est produite");
        }
    });

// Fonction utilitaire pour générer les permissions administrateur
function generateAdminPermissions() {
    const permissions = [
        'Organization', 'Step', 'Client', 'Procedure', 'Transaction', 
        'Invoice', 'Expense', 'Revenue', 'ComptaSettings', 'ClientProcedure', 
        'ClientStep', 'ClientDocument', 'Admin'
    ];
    
    const actions = ['Create', 'Read', 'Edit', 'Delete'];
    const permissionObject: Record<string, boolean> = {
        canChangeUserAuthorization: true,
        canChangeUserPassword: true,
    };

    permissions.forEach(permission => {
        actions.forEach(action => {
            const key = `can${action}${permission}`;
            permissionObject[key] = permission !== 'Organization' || action !== 'Create';
        });
    });

    return permissionObject;
}

// Fonction utilitaire pour l'envoi d'email
async function sendWelcomeEmail(
    clientInput: z.infer<typeof createOrganizationSchema>, 
    organization: { name: string; slug: string }
) {
    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Bienvenue sur LouraTech</h1>
            <p>Bonjour <strong>${clientInput.firstName} ${clientInput.lastName}</strong>,</p>
            
            <p>Félicitations ! Votre organisation <strong>"${organization.name}"</strong> a été créée avec succès sur LouraTech.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Détails de votre organisation :</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Nom :</strong> ${clientInput.organizationName}</li>
                    <li><strong>Description :</strong> ${clientInput.organizationDescription || "Non spécifiée"}</li>
                    <li><strong>Identifiant :</strong> ${organization.slug}</li>
                    <li><strong>Administrateur :</strong> ${clientInput.firstName} ${clientInput.lastName}</li>
                    <li><strong>Email :</strong> ${clientInput.email}</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/signin" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; display: inline-block;">
                    Se connecter à votre compte
                </a>
            </div>
            
            <p>Vous pouvez maintenant accéder à votre espace d'administration et commencer à configurer votre organisation.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
                Si vous avez des questions, n'hésitez pas à nous contacter.<br>
                L'équipe LouraTech
            </p>
        </div>
    `;

    await sendEmail({
        to: clientInput.email,
        subject: "🎉 Bienvenue sur LouraTech - Organisation créée avec succès",
        html: generateEmailMessageHtml({
            subject: "Bienvenue sur LouraTech",
            content: emailContent
        })
    });
}