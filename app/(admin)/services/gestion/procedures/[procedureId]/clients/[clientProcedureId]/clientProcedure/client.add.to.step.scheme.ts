import { z } from "zod";


export const addClientToStepSchema = z.object({
    clientId: z.string().min(1, "Veuillez sélectionner un client"),
    procedureId: z.string(),
    stepId: z.string().min(1, "Veuillez sélectionner une étape"),
    price: z.number().int().positive()
})