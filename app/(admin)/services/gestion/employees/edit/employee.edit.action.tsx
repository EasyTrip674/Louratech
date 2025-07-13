"use server"

import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { editEmployeeSheme } from "./employee.edit.shema";
import { employeeService } from "@/lib/services";

export const doEditEmployee = adminAction
    .metadata({actionName:"edit employee"})
    .schema(editEmployeeSheme)
    .action(async ({ clientInput, ctx }) => {
        try {
            console.log("Editing employee with data:", clientInput);

            // Vérifier l'autorisation
            if (ctx.user.userDetails?.authorize?.canEditAdmin === false) {
                throw new Error("Vous n'êtes pas autorisé à modifier cet employé");
            }

            // Utiliser le service employee
            const employee = await employeeService.updateEmployee(clientInput);

            revalidatePath("/app/(admin)/services/gestion/employees");
            
            return { success: true, employee };
        } catch (error) {
            console.error("Erreur lors de la modification de l'employé:", error);
            throw new Error(`Échec de la modification de l'employé: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    });