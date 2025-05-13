"use client"
import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { HelpCircle, Send, X, MessageSquare, AlertCircle, Lightbulb, HelpingHand } from "lucide-react";
import { Modal } from "../ui/modal";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { doAddFeedback } from "./feedback.action";

// Enum pour correspondre au schéma Prisma
export enum FeedbackType {
  BUG = "BUG",
  SUGGESTION = "SUGGESTION", 
  QUESTION = "QUESTION",
  OTHER = "OTHER"
}

// Schéma de validation Zod
const feedbackSchema = z.object({
  message: z.string().min(10, "Votre message doit contenir au moins 10 caractères"),
  type: z.nativeEnum(FeedbackType),
  name: z.string().optional(),
  email: z.string().email("Veuillez entrer un email valide").optional(),
  isAnonymous: z.boolean()
});

type FeedbackSubmission = z.infer<typeof feedbackSchema>;

// Fonction pour soumettre le feedback
const submitFeedback = async (data: FeedbackSubmission) => {
  const response = await doAddFeedback(data);
  
  if (response?.serverError) {
    const errorData = await response.serverError
    throw new Error(errorData || "Une erreur est survenue");
  }
  
  return response?.data
};

export default function FeedBackChat() {
  const { openModal, isOpen, closeModal } = useModal();
  const [feedback, setFeedback] = useState<FeedbackSubmission>({
    message: "",
    type: FeedbackType.OTHER,
    isAnonymous: true,
    name: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [characterCount, setCharacterCount] = useState(0);
  
  // Configuration de la mutation React Query
  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      // Réinitialiser le formulaire après un succès
      setTimeout(() => {
        setFeedback({
          message: "",
          type: FeedbackType.OTHER,
          isAnonymous: true,
          name: "",
        });
        setCharacterCount(0);
        closeModal();
        // Invalider potentiellement d'autres requêtes si nécessaire
      }, 2000);
    }
  });
  

  const validateForm = () => {
    try {
      feedbackSchema.parse(feedback);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      mutation.mutate(feedback);
    }
  };

  const handleMessageChange = (value: string) => {
    setFeedback(prev => ({ ...prev, message: value }));
    setCharacterCount(value.length);
  };

  // Objets pour les icônes et textes d'aide par type de feedback
  const feedbackTypeInfo = {
    [FeedbackType.BUG]: {
      icon: <AlertCircle className="size-5" />,
      helpText: "Décrivez le problème, les étapes pour le reproduire et ce qui était attendu."
    },
    [FeedbackType.SUGGESTION]: {
      icon: <Lightbulb className="size-5" />,
      helpText: "Partagez vos idées pour améliorer notre service ou ajouter de nouvelles fonctionnalités."
    },
    [FeedbackType.QUESTION]: {
      icon: <MessageSquare className="size-5" />,
      helpText: "Posez toute question concernant l'utilisation de notre plateforme."
    },
    [FeedbackType.OTHER]: {
      icon: <HelpingHand className="size-5" />,
      helpText: "Tout autre commentaire qui ne rentre pas dans les catégories précédentes."
    }
  };

  // Déterminer la couleur du compteur de caractères
  const getCounterColor = () => {
    if (characterCount === 0) return "text-gray-400";
    if (characterCount < 10) return "text-red-500";
    if (characterCount < 30) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 sm:block">
        <button
          onClick={openModal}
          aria-label="Ouvrir le formulaire de feedback"
          className="group inline-flex size-14 items-center justify-center rounded-full bg-brand-500 text-white transition-all duration-300 hover:bg-brand-600 hover:shadow-lg"
        >
          <HelpCircle className="size-6 group-hover:animate-pulse" />
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <div className="flex flex-col gap-4 relative">
          <button 
            onClick={closeModal} 
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fermer"
          >
            <X className="size-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <MessageSquare className="size-5" /> Votre Feedback
          </h2>

          {/* Sélecteur de type de feedback */}
          <div className="flex gap-2 flex-wrap">
            {Object.values(FeedbackType).map((type) => (
              <Button
                key={type}
                variant={feedback.type === type ? "primary" : "outline"}
                size="sm"
                onClick={() => setFeedback(prev => ({ ...prev, type }))}
                className="capitalize flex items-center gap-1"
              >
                {feedbackTypeInfo[type].icon}
                {type.toLowerCase()}
              </Button>
            ))}
          </div>

          {/* Texte d'aide basé sur le type de feedback sélectionné */}
          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 flex items-start gap-2">
            <div className="text-brand-500 mt-0.5">
              {feedbackTypeInfo[feedback.type].icon}
            </div>
            <p>{feedbackTypeInfo[feedback.type].helpText}</p>
          </div>

          {/* Zone de message avec compteur de caractères et validation */}
          <div className="relative">
            <TextArea
              value={feedback.message}
              onChangeValue={handleMessageChange}
              placeholder={`Partagez vos pensées${feedback.type === FeedbackType.BUG ? " (que s'est-il passé, comment le reproduire...)" : ""}...`}
              className={`resize-none h-40 transition-all duration-300 ${
                validationErrors.message 
                  ? "border-red-500 ring-2 ring-red-100" 
                  : feedback.message.length >= 10 
                    ? "border-brand-500 ring-2 ring-brand-100" 
                    : "border-gray-300"
              }`}
              disabled={mutation.isPending}
            />
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${validationErrors.message ? "text-red-500" : "text-gray-500"}`}>
                {validationErrors.message || ""}
              </span>
              <span className={`text-xs font-medium ${getCounterColor()}`}>
                {characterCount} caractères {characterCount < 10 ? "(min. 10)" : ""}
              </span>
            </div>
          </div>

          {/* Anonyme ou Identifié */}
          <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
            <input 
              type="checkbox" 
              id="anonymousToggle"
              checked={feedback.isAnonymous}
              onChange={() => setFeedback(prev => ({ 
                ...prev, 
                isAnonymous: !prev.isAnonymous,
                name: prev.isAnonymous ? "" : prev.name,
                email: prev.isAnonymous ? "" : prev.email
              }))}
              className="form-checkbox text-brand-500 rounded"
            />
            <label htmlFor="anonymousToggle" className="text-sm text-gray-700 dark:text-gray-200">
              Envoyer anonymement
            </label>
          </div>

          {/* Informations personnelles si non anonyme */}
          {!feedback.isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  value={feedback.name}
                  onChange={(e) => setFeedback(prev => ({ 
                    ...prev, 
                    name: e.target.value 
                  }))}
                  placeholder="Votre nom"
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>
                )}
              </div>
              <div>
                <Input 
                  type="email"
                  value={feedback.email}
                  onChange={(e) => setFeedback(prev => ({ 
                    ...prev, 
                    email: e.target.value 
                  }))}
                  placeholder="Votre email"
                  className={validationErrors.email ? "border-red-500" : ""}
                />
                {validationErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
                )}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Vos retours sont précieux pour nous aider à améliorer notre service.
          </p>

          <Button 
            onClick={handleSubmit}
            disabled={mutation.isPending || characterCount < 10}
            className="flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <span className="animate-pulse">Envoi en cours...</span>
            ) : mutation.isSuccess ? (
              <>
                <Send className="size-4 mr-2" /> Merci pour votre feedback!
              </>
            ) : mutation.isError ? (
              "Erreur, réessayez"
            ) : (
              <>
                <Send className="size-4 mr-2" /> Envoyer
              </>
            )}
          </Button>
          
          {mutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {mutation.error instanceof Error ? mutation.error.message : "Une erreur est survenue. Veuillez réessayer."}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}