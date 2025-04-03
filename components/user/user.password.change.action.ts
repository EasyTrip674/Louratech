"use server"

import { adminAction } from "@/lib/safe-action"

import prisma from "@/db/prisma";

import { revalidatePath } from "next/cache";
import { passwordSchema } from "./user.password.shema";
import { auth } from "@/lib/auth";

export const doChangePassword = adminAction
    .metadata({actionName:"change password"}) // ✅ Ajout des métadonnées obligatoires
    .schema(passwordSchema)
    .action(async ({clientInput:{userId,newPassword, confirmPassword,currentPassword}}) => {  
        console.log("changing password for user:", userId);

        if (newPassword !== confirmPassword) {
            throw new Error("les mots de passe ne correspondent pas");      
        }

        // Check if the current password is correct
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        await auth.api.changePassword({
            body: {
                newPassword: newPassword,
                currentPassword: currentPassword,
                revokeOtherSessions: false,     
            }});
     

        revalidatePath("/app/(admin)/services/gestion");

        return { success: true };
    });
       