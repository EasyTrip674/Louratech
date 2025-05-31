import { z } from "zod";

export const deleteStepSchema = z.object({
    stepId:z.string(),
    nameStep:z.string(),
    deleteTransactionAssocied:z.boolean().default(false)
})