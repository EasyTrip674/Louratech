"use server";

import { adminAction } from "@/lib/safe-action";
import { employeeService } from "@/lib/services";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schémas de validation
const createEmployeeSchema = z.object({
  email: z.string().email("Email invalide"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const updateEmployeeSchema = z.object({
  id: z.string().min(1, "ID requis"),
  email: z.string().email("Email invalide"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const deleteEmployeeSchema = z.object({
  id: z.string().min(1, "ID requis"),
});

// Actions serveur
export const createEmployeeAction = adminAction
  .metadata({ actionName: "create employee" })
  .schema(createEmployeeSchema)
  .action(async ({ clientInput }) => {
    try {
      // Vérifier que les mots de passe correspondent
      if (clientInput.password !== clientInput.confirmPassword) {
        return { 
          success: false, 
          error: "Les mots de passe ne correspondent pas" 
        };
      }

      const employee = await employeeService.createEmployee({
        email: clientInput.email,
        firstName: clientInput.firstName,
        lastName: clientInput.lastName,
        password: clientInput.password,
        phone: clientInput.phone,
        address: clientInput.address,
      });
      
      revalidatePath("/app/(admin)/services/gestion/employees");
      
      return { success: true, employee };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const updateEmployeeAction = adminAction
  .metadata({ actionName: "update employee" })
  .schema(updateEmployeeSchema)
  .action(async ({ clientInput }) => {
    try {
      const employee = await employeeService.updateEmployee(clientInput);
      
      revalidatePath("/app/(admin)/services/gestion/employees");
      
      return { success: true, employee };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });

export const deleteEmployeeAction = adminAction
  .metadata({ actionName: "delete employee" })
  .schema(deleteEmployeeSchema)
  .action(async ({ clientInput }) => {
    try {
      await employeeService.deleteEmployee(clientInput.id);
      
      revalidatePath("/app/(admin)/services/gestion/employees");
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  }); 