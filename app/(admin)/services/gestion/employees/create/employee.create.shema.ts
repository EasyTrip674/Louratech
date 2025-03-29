import { z } from "zod";

export const createEmployeeSheme = z.object({
    firstName: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères" }),
    lastName: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
    email: z.string().email({ message: "Adresse email invalide" }),
    phone: z.string().optional(),
    address: z.string().optional(),
    password: z.string().min(8, { message: "Le mot de passe doit comporter au moins 8 caractères" }),
    confirmPassword: z.string().min(8, { message: "La confirmation du mot de passe doit comporter au moins 8 caractères" }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});
