import { z } from "zod";

export const deleteClientStepSchema = z.object({
    ClientStepId:z.string(),
    ClientStepName:z.string(),
    deleteTransactionAssocied:z.boolean().default(false)
})