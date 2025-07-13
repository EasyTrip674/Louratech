"use server"

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { deleteEmployeeSchema } from "./employee.delete.shema";
import { employeeService } from "@/lib/services";

export const doDeleteEmployee = adminAction
    .metadata({actionName:"delete Employee"})
    .schema(deleteEmployeeSchema)
    .action(async ({ clientInput, ctx }) => {
        try {
            console.log("Deleting Employee with data:", clientInput);
            
            // Vérifier l'autorisation
            if (ctx.user.userDetails?.authorize?.canDeleteAdmin === false) {
                throw new Error("Vous n'êtes pas autorisé à supprimer cet employé");
            }

            // Utiliser le service employee
            await employeeService.deleteEmployee(clientInput.id);

            revalidatePath("/app/(admin)/services/gestion/employees");
            return { success: true };
        } catch (error) {
            console.error("Erreur lors de la suppression de l'employé:", error);
            throw new Error(`Échec de la suppression de l'employé: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    });