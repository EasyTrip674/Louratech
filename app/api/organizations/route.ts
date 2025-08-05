// app/api/organizations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/prisma';
import { auth } from '@/lib/auth';
import { sendEmail } from '@/lib/nodemailer/email';
import { generateEmailMessageHtml } from '@/lib/nodemailer/message';
import { createOrganizationSchema } from '@/app/auth/organization/create.organization.shema';
import { Role } from '@prisma/client';
import { z } from 'zod';

// Rate limiting avec Redis-like behavior (en mémoire pour l'instant)
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

// Validation des codes d'invitation
const VALID_INVITATION_CODES = process.env.INVITATION_CODES?.split(',') || 
    ["LouraFlash01", "louraAlpha02", "monAgenceLoura01"];

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

// POST /api/organizations - Créer une organisation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validation du schéma
        const validatedData = createOrganizationSchema.parse(body);
        
        // 1. Rate limiting
        if (!RateLimiter.check(validatedData.email)) {
            return NextResponse.json(
                { error: "Trop de tentatives. Veuillez attendre 5 minutes." },
                { status: 429 }
            );
        }

        // 2. Validation du code d'invitation
        if (!VALID_INVITATION_CODES.includes(validatedData.invitationCode)) {
            return NextResponse.json(
                { error: "Code d'invitation invalide" },
                { status: 400 }
            );
        }

        // 3. Génération du slug unique
        const baseSlug = validatedData.organizationName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        // Créer l'utilisateur avec Better Auth
        const userAuth = await auth.api.signUpEmail({
            body: {
                email: validatedData.email,
                password: validatedData.password,
                name: `${validatedData.firstName} ${validatedData.lastName}`,
            }
        });

        if (!userAuth.user) {
            return NextResponse.json(
                { error: "Échec de la création de l'utilisateur" },
                { status: 500 }
            );
        }

        // 4. Transaction principale avec vérifications atomiques
        const result = await prisma.$transaction(async (tx) => {
            // Vérifier l'existence de l'utilisateur
            const existingUser = await tx.user.findUnique({
                where: { email: validatedData.email },
                select: { id: true, email: true }
            });
            console.log("================================");
            console.log(existingUser);
            console.log("================================");

            if (!existingUser) {
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
                    firstName: validatedData.firstName,
                    lastName: validatedData.lastName,
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
                    name: validatedData.organizationName,
                    description: validatedData.organizationDescription || "",
                    slug,
                    logo: "",
                    metadata: JSON.stringify({
                        createdBy: updatedUser.id,
                        createdAt: new Date().toISOString(),
                        invitationCode: validatedData.invitationCode
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
            maxWait: 5000,
            timeout: 10000,
            isolationLevel: 'Serializable'
        });

        // 5. Envoi de l'email de bienvenue (en dehors de la transaction)
        try {
            await sendWelcomeEmail(validatedData, result.organization);
        } catch (emailError) {
            console.error("Erreur lors de l'envoi de l'email:", emailError);
            // Ne pas faire échouer la création pour un problème d'email
        }

        // 6. Reset du rate limiting en cas de succès
        RateLimiter.reset(validatedData.email);

        return NextResponse.json({
            success: true,
            data: {
                organization: {
                    id: result.organization.id,
                    name: result.organization.name,
                    slug: result.organization.slug,
                    description: result.organization.description
                },
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    role: result.user.role
                }
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Erreur lors de la création de l'organisation:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { 
                    error: "Données invalides",
                    details: error.errors
                },
                { status: 400 }
            );
        }
        
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { error: "Une erreur inattendue s'est produite" },
            { status: 500 }
        );
    }
}
