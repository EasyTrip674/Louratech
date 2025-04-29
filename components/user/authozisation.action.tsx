"use server";
import prisma from "@/db/prisma";
import { adminAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { authorizationSchema } from "./authorization.shema";

export const doChangeAuthozation = adminAction
  .metadata({ actionName: "change password" })
  .schema(authorizationSchema)
  .action(async ({ clientInput }) => {

    console.log("Changing authorization for user:", clientInput.userId);
    const { userId, authozationId, authorization } = clientInput;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }
    const userAuthorization = await prisma.authorization.findUnique({
      where: { id: authozationId },
    });
    if (!userAuthorization) {
      throw new Error("Autorisation introuvable");
    }
    // Mettre à jour l'autorisation dans la base de données
    await prisma.authorization.update({
      where: { id: authozationId },
      data: {
        ...authorization,
      },
    });

    // Revalider le cache pour la page d'administration
    revalidatePath("/app/(admin)/services/gestion");
   
    return { success: true };
  });
