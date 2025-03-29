import { z } from "zod";

export const createOrganizationSchema = z.object({
    // Détails de l'organisation
    organizationName: z.string().min(2, { message: "Le nom de l'organisation doit contenir au moins 2 caractères" }),
    organizationDescription: z.string().optional(),
  
    // Détails de l'administrateur
    firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
    lastName: z.string().min(2, { message: "Le nom de famille doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Veuillez saisir une adresse email valide" }),
    password: z.string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
      }),
    confirmPassword: z.string(),
  
    // Conditions d'utilisation
    agreesToTerms: z.boolean().refine(val => val, { 
      message: "Vous devez accepter les conditions d'utilisation" 
    })
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  });