import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number(),
  paymentMethod: z.string(),
  status: z.string(),
  stepId: z.string(),
  clientProcedureId: z.string(),
});
  
 