import { z } from "zod";

export const editStepProcedureSchema = z.object({
    name: z.string().min(1, "Veuillez saisir un nom"),
    description: z.string().optional(),
    price: z.number().int().positive().optional(),
    procedureId: z.string(),
    stepId:z.string(),
    estimatedDuration: z.number().int().positive().optional(),
    order: z.number().int().positive().optional(),
    isRequired: z.boolean().optional(),
   });
