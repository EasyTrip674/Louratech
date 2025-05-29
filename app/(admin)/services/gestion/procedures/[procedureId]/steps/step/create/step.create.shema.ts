import { z } from "zod";

export const createStepProcedureSchema = z.object({
    name: z.string().min(1, "Veuillez saisir un nom"),
    description: z.string().optional(),
    price: z.number().min(0, { message: "Le prix doit être supérieur ou égal à 0" }),
    procedureId: z.string(),
    estimatedDuration: z.number().int().positive().optional(),
    order: z.number().int().positive().optional(),
    isRequired: z.boolean().optional(),
   });
