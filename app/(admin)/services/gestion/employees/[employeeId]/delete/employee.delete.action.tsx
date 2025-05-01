"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { deleteEmployeeSchema } from "./employee.delete.shema";

export const doDeleteEmployee = adminAction
    .metadata({actionName:"delete Employee"}) // ✅ Ajout des métadonnées obligatoires
    .schema(deleteEmployeeSchema)
    .action(async ({ clientInput, ctx }) => {
        console.log("deleting Employee with data:", clientInput);
        
        // Vérifier si l'utilisateur est autorisé à supprimer un employé/admin
        if (ctx.user.userDetails?.authorize?.canDeleteAdmin === false) {
            throw new Error("Vous n'êtes pas autorisé à supprimer cet employé");
        }

        try {
            // 1. Récupérer l'ID utilisateur associé à l'employé
            const employee = await prisma.admin.findUnique({
                where: { id: clientInput.id },
                include: { user: true }
            });

         

            if (!employee) {
                throw new Error("Employé introuvable");
            }

            // deconneter l'utilisateur de toute les sessions
               await prisma.session.deleteMany({
                where: { userId: employee?.userId }
            });

            //  deconnecter les accounts de l'utilisateur
            await prisma.account.deleteMany({
                where: { userId: employee?.userId }
            });


            const userId = employee.userId;

            // 2. Vérifier si l'utilisateur a des procédures client assignées
            const hasAssignedProcedures = await prisma.clientProcedure.count({
                where: {
                    OR: [
                        { assignedToId: userId },
                        { managerId: userId }
                    ]
                }
            }) > 0;

            if (hasAssignedProcedures) {
                // Mettre à jour les procédures client pour enlever cet employé comme responsable
                await prisma.clientProcedure.updateMany({
                    where: { assignedToId: userId },
                    data: { assignedToId: null }
                });

                await prisma.clientProcedure.updateMany({
                    where: { managerId: userId },
                    data: { managerId: null }
                });
            }

            // 3. Vérifier si l'utilisateur a des étapes client traitées
            const hasProcessedSteps = await prisma.clientStep.count({
                where: { processedById: userId }
            }) > 0;

            if (hasProcessedSteps) {
                // Mettre à jour les étapes client pour enlever cet employé comme responsable
                await prisma.clientStep.updateMany({
                    where: { processedById: userId },
                    data: { processedById: null }
                });
            }

            // 4. Gérer les invitations créées par cet employé
            await prisma.invitation.deleteMany({
                where: { inviterId: userId }
            });

            // 5. Mettre à jour les transactions créées/approuvées par cet employé
            // (conserver les transactions mais enlever la référence à l'employé)
            await prisma.transaction.updateMany({
                where: { createdById: userId },
                data: { createdById: ctx.user.userDetails?.id  } // Assigner au suppresseur
            });

            await prisma.transaction.updateMany({
                where: { approvedById: userId },
                data: { approvedById: null }
            });

            // 6. Mettre à jour les dépenses créées par cet employé
            await prisma.expense.updateMany({
                where: { createdById: userId },
                data: { createdById: ctx.user.userDetails?.id } // Assigner au suppresseur
            });

            // 7. Mettre à jour les revenus créés par cet employé
            await prisma.revenue.updateMany({
                where: { createdById: userId },
                data: { createdById: ctx.user.userDetails?.id  } // Assigner au suppresseur
            });

            // 8. Mettre à jour les factures créées par cet employé
            await prisma.invoice.updateMany({
                where: { createdById: userId },
                data: { createdById: ctx.user.userDetails?.id } // Assigner au suppresseur
            });

            // 9. Supprimer les autorisations associées
            try {
                await prisma.authorization.delete({
                    where: { userId: userId }
                });
            } catch  {
                // Si l'autorisation n'existe pas, continuer sans erreur
                console.log("Aucune autorisation trouvée pour cet employé");
            }

            // 10. Supprimer les sessions actives
            await prisma.session.deleteMany({
                where: { userId: userId }
            });

            // 11. Supprimer l'adhésion à l'organisation
            await prisma.member.deleteMany({
                where: { userId: userId }
            });

            // 12. Supprimer l'admin/employé
            await prisma.admin.delete({
                where: { id: clientInput.id }
            });

            // 13. Désactiver l'utilisateur associé
            await prisma.user.update({
                where: { id: userId },
                data: { 
                    organizationId: null,
                    active: false
                }
            });

            revalidatePath("/app/(admin)/services/gestion/employees");
            return { success: true };
        } catch (error) {
            console.error("Erreur lors de la suppression de l'employé:", error);
            throw new Error(`Échec de la suppression de l'employé: ${error}`);
        }
    });