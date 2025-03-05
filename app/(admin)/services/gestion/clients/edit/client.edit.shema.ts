import { z } from "zod";

export const editClientSchema = z.object({
    id: z.string(),
    firstName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    phone: z.string().optional(),
    passport: z.string().optional(),
    address: z.string().optional(),
    birthDate: z.string().optional(),
    fatherLastName: z.string().optional(),
    fatherFirstName: z.string().optional(),
    motherLastName: z.string().optional(),
    motherFirstName: z.string().optional(),
   });
