import { z } from "zod";

export const deleteEmployeeSchema = z.object({
    id: z.string(),
    lastName: z.string().min(1, { message: "nom requis" }),
   });

