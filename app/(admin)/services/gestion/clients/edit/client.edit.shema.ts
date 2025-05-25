import { z } from "zod";

export const editClientSchema = z.object({
    id: z.string(),
    firstName: z.string().min(2, { message: "Minimium 2 caracteres" }),
    lastName: z.string().min(2, { message: "Minimium 2 caracteres" }),
    phone: z.string().optional(),
    passport: z.string().optional(),
    address: z.string().optional(),
    birthDate: z.string().optional(),
    fatherLastName: z.string().optional(),
    fatherFirstName: z.string().optional(),
    motherLastName: z.string().optional(),
    email: z.string().email("L'email doit etre valide !! "),
    motherFirstName: z.string().optional(),
   });
