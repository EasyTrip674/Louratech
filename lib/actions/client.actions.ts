"use server";

import { adminAction } from "@/lib/safe-action";
import { clientService, CreateClientData } from "@/lib/services";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schémas de validation
const createClientSchema = z.object({
  email: z.string().email("Email invalide"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  phone: z.string().optional(),
  passport: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.date().optional(),
  fatherLastName: z.string().optional(),
  fatherFirstName: z.string().optional(),
  motherLastName: z.string().optional(),
  motherFirstName: z.string().optional(),
});

const updateClientSchema = z.object({
  id: z.string().min(1, "ID requis"),
  email: z.string().email("Email invalide"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  phone: z.string().optional(),
  passport: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.date().optional(),
  fatherLastName: z.string().optional(),
  fatherFirstName: z.string().optional(),
  motherLastName: z.string().optional(),
  motherFirstName: z.string().optional(),
});

const deleteClientSchema = z.object({
  id: z.string().min(1, "ID requis"),
});

// Actions serveur
export const createClientAction = adminAction
  .metadata({ actionName: "create client" })
  .schema(createClientSchema)
  .action(async ({ clientInput }) => {
    try {
      const client = await clientService.createClient(clientInput as CreateClientData);
      
      revalidatePath("/app/(admin)/services/gestion/clients");
      
      return { success: true, client };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    }
  });

export const updateClientAction = adminAction
  .metadata({ actionName: "update client" })
  .schema(updateClientSchema)
  .action(async ({ clientInput }) => {
    try {
      const client = await clientService.updateClient(clientInput);
      
      revalidatePath("/app/(admin)/services/gestion/clients");
      
      return { success: true, client };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    }
  });

export const deleteClientAction = adminAction
  .metadata({ actionName: "delete client" })
  .schema(deleteClientSchema)
  .action(async ({ clientInput }) => {
    try {
      await clientService.deleteClient(clientInput.id);
      
      revalidatePath("/app/(admin)/services/gestion/clients");
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    }
  }); 