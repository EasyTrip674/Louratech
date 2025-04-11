"use server";
import { auth } from "@/lib/auth"; // Votre instance Better Auth
import prisma from "@/db/prisma";
import { adminAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { passwordSchema } from "./user.password.shema";

export const doChangePassword = adminAction
  .metadata({ actionName: "change password" })
  .schema(passwordSchema)
  .action(async ({ clientInput: { userId, newPassword, confirmPassword, currentPassword }, ctx }) => {
    console.log("Changing password for user:", userId);

    if (newPassword !== confirmPassword) {
      throw new Error("Les mots de passe ne correspondent pas");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user || !user.account || user.account.length === 0) {
      throw new Error("Utilisateur introuvable ou sans compte associé");
    }

    const email = user.email;
    if (!email) {
      throw new Error("L'utilisateur n'a pas d'email associé");
    }

    // Vérifier le mot de passe actuel
    const signInResponse = await auth.api.signInEmail({
      body: { email, password: currentPassword },
    });

    if (signInResponse.user.email === null) {
      throw new Error("Mot de passe actuel incorrect");
    }

    // Hacher le nouveau mot de passe
    const ctxAuth = await auth.$context;
    const hashPassword = await ctxAuth.password.hash(newPassword);

    // Mettre à jour le mot de passe dans la base de données
    await ctxAuth.internalAdapter.updatePassword(userId, hashPassword);

    revalidatePath("/app/(admin)/services/gestion");

    return { success: true };
  });
