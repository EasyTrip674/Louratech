import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().min(0, "Le montant doit être positif"),
  paymentMethod: z.string().min(1, "La méthode de paiement est requise"),
  status: z.string().min(1, "Le statut est requis"),
  clientStepId: z.string().min(1, "L'étape client est requise"),
});
  
 