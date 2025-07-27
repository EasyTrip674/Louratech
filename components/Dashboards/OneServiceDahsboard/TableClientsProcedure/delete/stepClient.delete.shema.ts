import { z } from "zod";

export const deleteClientProcedureSchema = z.object({
    ClientProcedureId:z.string(),
    ClientProcedureName:z.string(),
    deleteTransactionAssocied:z.boolean().default(false)
})