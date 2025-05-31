import { z } from "zod";

export const deleteTransactionSchema = z.object({
    transactionId:z.string().min(1,"transaction requis"),
    confirmMessage: z.string().min(1,"Il faut confirmer avant de passer")
})


export  const confirmMessage = "je valide la suppression"
 