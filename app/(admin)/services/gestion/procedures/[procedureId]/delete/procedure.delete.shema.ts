import { z } from "zod";

export const deleteProcedureSchema = z.object({
    procedureId:z.string(),
    procedureName:z.string(),
    deleteTransactionAssocied:z.boolean().default(false)
})