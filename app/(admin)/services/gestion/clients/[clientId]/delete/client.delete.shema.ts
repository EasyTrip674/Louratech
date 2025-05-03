import { z } from "zod";

export const deleteClientSchema = z.object({
    id: z.string(),
    lastName: z.string().min(1, { message: "nom requis" }),
   });
