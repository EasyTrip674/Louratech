import { FeedbackImpact, FeedbackSatisfaction } from "@prisma/client";
import { z } from "zod";

export enum FeedbackType {
    BUG = "BUG",
    SUGGESTION = "SUGGESTION", 
    QUESTION = "QUESTION",
    OTHER = "OTHER"
}
  
export const feedbackSchema = z.object({
  message: z.string().min(5, "Votre message doit contenir au moins 5 caractères"),
  type: z.nativeEnum(FeedbackType),
  subtype: z.string(),
  rating: z.number().min(0).max(5).optional(),
  satisfaction: z.nativeEnum(FeedbackSatisfaction),
  impact: z.nativeEnum(FeedbackImpact),
  name: z.string().optional(),
  email: z.string().email("Veuillez entrer un email valide").optional(),
  isAnonymous: z.boolean()
});



// Enum pour correspondre au schéma Prisma


  // Sous-catégories de feedback par type principal
 export const feedbackSubcategories = {
    [FeedbackType.BUG]: [
      { id: "login", label: "Problème de connexion" },
      { id: "performance", label: "Lenteur/Performance" },
      { id: "display", label: "Affichage incorrect" },
      { id: "crash", label: "Crash/Erreur" },
      { id: "other", label: "Autre problème" }
    ],
    [FeedbackType.SUGGESTION]: [
      { id: "ui", label: "Interface utilisateur" },
      { id: "feature", label: "Nouvelle fonctionnalité" },
      { id: "workflow", label: "Amélioration de processus" },
      { id: "other", label: "Autre suggestion" }
    ],
    [FeedbackType.QUESTION]: [
      { id: "usage", label: "Utilisation" },
      { id: "account", label: "Compte/Profil" },
      { id: "billing", label: "Facturation" },
      { id: "technical", label: "Support technique" },
      { id: "other", label: "Autre question" }
    ],
    [FeedbackType.OTHER]: [
      { id: "praise", label: "Compliment" },
      { id: "concern", label: "Préoccupation" },
      { id: "other", label: "Autre" }
    ]
  };
  