"use server"

import { adminAction } from "@/lib/safe-action"

import prisma from "@/db/prisma";

import { revalidatePath } from "next/cache";
import { passwordSchema } from "./user.password.shema";
import { authClient } from "@/lib/auth-client";

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

       const data =  await authClient.changePassword({
            newPassword: newPassword,
            currentPassword: currentPassword,
            revokeOtherSessions: false, // revoke all other sessions the user is signed into
        });

      if(data.error){
        throw new Error(JSON.stringify(data.error));
      }
    

        if (!data) {
            throw new Error("Erreur lors du changement de mot de passe");
        }
        

        revalidatePath("/app/(admin)/services/gestion");

        return { success: true };
   
    });
       