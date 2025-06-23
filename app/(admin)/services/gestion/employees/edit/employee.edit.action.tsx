"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { editEmployeeSheme } from "./employee.edit.shema";

export const doEditEmployee = adminAction
    .metadata({actionName:"edit employee"})
    .schema(editEmployeeSheme)
    .action(async ({ clientInput, ctx }) => {
        try {
            console.log("editing employee with data:", clientInput);

            // Vérifier s'il est autorisé
            if (ctx.user.userDetails?.authorize?.canEditAdmin === false) {
                throw new Error("Vous n'êtes pas autorisé à modifier cet utilisateur");
            }

            // Vérifier l'existence de l'employé AVANT de continuer
            const existingEmployee = await prisma.admin.findUnique({
                where: {
                    id: clientInput.id,
                },
                include: {
                    user: true,
                    organization: true
                }
            });

            if (!existingEmployee) {
                throw new Error("Employé introuvable");
            }

            // Vérifier que l'employé appartient à la même organisation
            if (existingEmployee.organizationId !== ctx.user.userDetails?.organization?.id) {
                throw new Error("Vous n'êtes pas autorisé à modifier cet employé");
            }

            // Utiliser une transaction pour toutes les opérations de base de données
            const result = await prisma.$transaction(async (tx) => {
                // Mettre à jour les données de l'employé
                const updatedEmployee = await tx.admin.update({
                    where: {
                        id: clientInput.id,
                    },
                    data: {
                        phone: clientInput.phone,
                        address: clientInput.address,
                        user: {
                            update: {
                                firstName: clientInput.firstName,
                                lastName: clientInput.lastName,
                            },
                        },
                    },
                    include: {
                        user: true,
                        organization: true
                    }
                });

                return updatedEmployee;
            });

            // Revalider le cache
            revalidatePath("/app/(admin)/services/gestion/employees");
            
            return { success: true, employee: result };

        } catch (error) {
            console.error("Error editing employee:", error);
            throw error;
        }
    });