"use server"
import bcrypt from "bcrypt";

import { adminAction } from "@/lib/safe-action"

import prisma from "@/db/prisma";

import { revalidatePath } from "next/cache";
import { passwordSchema } from "./user.password.shema";

export const doChangePassword = adminAction
    .metadata({actionName:"change password"}) // ✅ Ajout des métadonnées obligatoires
    .schema(passwordSchema)
    .action(async ({clientInput:{userId,newPassword, confirmPassword,currentPassword}}) => {  
        console.log("changing password for user:", userId);

        // Check if the current password is correct
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            throw new Error("Current password is incorrect");
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
            },
        });

        revalidatePath("/app/(admin)/services/gestion");

        return { success: true };
    });
       