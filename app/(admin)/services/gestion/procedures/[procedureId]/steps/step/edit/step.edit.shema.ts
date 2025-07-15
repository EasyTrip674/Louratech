import { z } from "zod";

export const editStepProcedureSchema = z.object({
    name: z.string().min(1, "Veuillez saisir un nom"),
    description: z.string().optional(),
    price: z.number().min(0, "Le prix doit être positif").optional(),
    procedureId: z.string(),
    stepId: z.string(),
    estimatedDuration: z.number().int().min(0, "Durée estimée invalide").optional(),
    order: z.number().int().min(1, "L'ordre doit être positif").optional(),
    isRequired: z.boolean().optional(),
});

