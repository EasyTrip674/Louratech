import { z } from "zod";

export const createProcedureScheme = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    price: z.number().optional(),
});
