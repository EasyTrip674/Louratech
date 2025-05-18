"use client"
import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { 
  HelpCircle, Send, X, MessageSquare, AlertCircle, 
  Lightbulb, HelpingHand, Star, ThumbsUp, ThumbsDown 
} from "lucide-react";
import { Modal } from "../ui/modal";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { doAddFeedback } from "./feedback.action";
import { feedbackSchema, feedbackSubcategories, FeedbackType } from "./feedback.shema";
import { FeedbackImpact, FeedbackSatisfaction } from "@prisma/client";


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
  const [step, setStep] = useState(1);
  const [feedback, setFeedback] = useState<FeedbackSubmission>({
    message: "",
    type: FeedbackType.OTHER,
    subtype: "other",
    rating: 0,
    satisfaction: FeedbackSatisfaction.NEUTRAL,
    impact: FeedbackImpact.MINOR,
    isAnonymous: true,
    name: "",
  });
  

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [characterCount, setCharacterCount] = useState(0);
  
  // Configuration de la mutation React Query
  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      setTimeout(() => {
        setFeedback({
          message: "",
          type: FeedbackType.OTHER,
          subtype: "other",
          rating: 0,
          satisfaction: FeedbackSatisfaction.NEUTRAL,
          impact: FeedbackImpact.MINOR,
          isAnonymous: true,
          name: "",
        });
        setCharacterCount(0);
        setStep(1);
        closeModal();
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
    console.log("Message:", feedback);
    
    setFeedback(prev => ({ ...prev, message: value 
    }));
    setCharacterCount(value.length);
  };

  const handleTypeChange = (type: FeedbackType) => {
    setFeedback(prev => ({ 
      ...prev, 
      type, 
      subtype: feedbackSubcategories[type][0].id,
      rating: 0,
      satisfaction: FeedbackSatisfaction.NEUTRAL,
      impact: FeedbackImpact.MINOR,

    }));
  };

  // Objets pour les icônes et textes d'aide par type de feedback
  const feedbackTypeInfo = {
    [FeedbackType.BUG]: {
      icon: <AlertCircle className="size-5" />,
      helpText: "Signalez un problème que vous avez rencontré",
      color: "text-red-500"
    },
    [FeedbackType.SUGGESTION]: {
      icon: <Lightbulb className="size-5" />,
      helpText: "Partagez vos idées d'amélioration",
      color: "text-amber-500"
    },
    [FeedbackType.QUESTION]: {
      icon: <MessageSquare className="size-5" />,
      helpText: "Posez une question sur notre plateforme",
      color: "text-blue-500"
    },
    [FeedbackType.OTHER]: {
      icon: <HelpingHand className="size-5" />,
      helpText: "Tout autre commentaire ou retour",
      color: "text-purple-500"
    }
  };

  // Rendu conditionnel selon l'étape
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Quel type de feedback souhaitez-vous partager ?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(FeedbackType).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    handleTypeChange(type);
                    setStep(2);
                  }}
                  className={`flex items-center p-4 gap-3 rounded-lg border border-gray-200 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-600 transition-all duration-200 group`}
                >
                  <div className={`p-2 rounded-full ${
                    type === FeedbackType.BUG ? "bg-red-100" :
                    type === FeedbackType.SUGGESTION ? "bg-amber-100" :
                    type === FeedbackType.QUESTION ? "bg-blue-100" : 
                    "bg-purple-100"
                  }`}>
                    <span className={feedbackTypeInfo[type].color}>
                      {feedbackTypeInfo[type].icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium capitalize dark:text-white">{
                      type === FeedbackType.OTHER ? "Autre" : type.toLowerCase()
                      }</h4>
                    <p className="text-xs text-gray-500 dark:text-white/90">{feedbackTypeInfo[type].helpText}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setStep(1)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className={feedbackTypeInfo[feedback.type].color}>
                  {feedbackTypeInfo[feedback.type].icon}
                </span>
                {feedback.type.toLowerCase().charAt(0).toUpperCase() + feedback.type.toLowerCase().slice(1)}
              </h3>
            </div>

            {/* Sous-catégories */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Précisez votre {feedback.type === FeedbackType.BUG ? "problème" : 
                  feedback.type === FeedbackType.SUGGESTION ? "suggestion" : 
                  feedback.type === FeedbackType.QUESTION ? "question" : "feedback"}
              </label>
              <div className="flex flex-wrap gap-2">
                {feedbackSubcategories[feedback.type].map((subcat) => (
                  <button
                    key={subcat.id}
                    onClick={() => setFeedback(prev => ({ ...prev, subtype: subcat.id }))}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                      feedback.subtype === subcat.id 
                        ? "bg-brand-100 border-brand-500 text-brand-700 border" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-transparent"
                    }`}
                  >
                    {subcat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Évaluation selon le type */}
            {feedback.type === FeedbackType.BUG && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Impact du problème
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "critical", label: "Critique", color: "bg-red-100 text-red-700 border-red-200" },
                    { id: "major", label: "Majeur", color: "bg-orange-100 text-orange-700 border-orange-200" },
                    { id: "minor", label: "Mineur", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                  ].map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setFeedback(prev => ({ ...prev, impact: level.id as FeedbackImpact }))}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                        feedback.impact === level.id ? `${level.color} border` : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-transparent"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {feedback.type === FeedbackType.OTHER && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Votre sentiment
                </label>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setFeedback(prev => ({ ...prev, satisfaction: FeedbackSatisfaction.NEGATIVE }))}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${
                      feedback.satisfaction === FeedbackSatisfaction.NEGATIVE ? "bg-red-50 text-red-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <ThumbsDown className={`size-8 ${feedback.satisfaction ===  FeedbackSatisfaction.NEGATIVE ? "fill-red-100" : ""}`} />
                    <span className="text-xs mt-1">Insatisfait</span>
                  </button>
                  <button
                    onClick={() => setFeedback(prev => ({ ...prev, satisfaction:  FeedbackSatisfaction.NEUTRAL }))}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${
                      feedback.satisfaction ===  FeedbackSatisfaction.NEUTRAL ? "bg-gray-50 text-gray-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-8 ${feedback.satisfaction ===  FeedbackSatisfaction.NEUTRAL  ? "fill-gray-100" : ""}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12h10.5" />
                    </svg>
                    <span className="text-xs mt-1">Neutre</span>
                  </button>
                  <button
                    onClick={() => setFeedback(prev => ({ ...prev, satisfaction:  FeedbackSatisfaction.POSITIVE }))}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${
                      feedback.satisfaction ===  FeedbackSatisfaction.POSITIVE  ? "bg-green-50 text-green-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <ThumbsUp className={`size-8 ${feedback.satisfaction ===  FeedbackSatisfaction.POSITIVE  ? "fill-green-100" : ""}`} />
                    <span className="text-xs mt-1">Satisfait</span>
                  </button>
                </div>
              </div>
            )}

            {feedback.type === FeedbackType.SUGGESTION && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Comment évaluez-vous cette fonctionnalité ?
                </label>
                <div className="flex justify-center">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                        className="p-1 focus:outline-none"
                      >
                        <Star 
                          className={`size-8 ${
                            (feedback.rating || 0) >= star 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          } hover:text-yellow-400 transition-colors`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-center text-xs text-gray-500 mt-1">
                  {feedback.rating === 0 && "Sélectionnez une note"}
                  {feedback.rating === 1 && "Pas prioritaire"}
                  {feedback.rating === 2 && "Peu important"}
                  {feedback.rating === 3 && "Utile"}
                  {feedback.rating === 4 && "Très utile"}
                  {feedback.rating === 5 && "Indispensable"}
                </p>
              </div>
            )}

            {/* Zone de message */}
            <div className="relative">
              <TextArea
                value={feedback.message}
                onChangeValue={handleMessageChange}
                placeholder={
                  feedback.type === FeedbackType.BUG ? "Décrivez le problème rencontré..." :
                  feedback.type === FeedbackType.SUGGESTION ? "Décrivez votre idée..." :
                  feedback.type === FeedbackType.QUESTION ? "Posez votre question..." :
                  "Partagez vos commentaires..."
                }
                className={`resize-none h-32 transition-all duration-300  text-black dark:text-white ${
                  validationErrors.message 
                    ? "border-red-500 ring-2 ring-red-100" 
                    : feedback.message.length >= 5 
                      ? "border-brand-500 ring-2 ring-brand-100" 
                      : "border-gray-300"
                }`}
                disabled={mutation.isPending}
              />
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${validationErrors.message ? "text-red-500" : "text-gray-500"}`}>
                  {validationErrors.message || ""}
                </span>
                <span className={`text-xs font-medium ${
                  characterCount === 0 ? "text-gray-400" :
                  characterCount < 5 ? "text-red-500" :
                  "text-green-500"
                }`}>
                  {characterCount} caractères {characterCount < 5 ? "(min. 5)" : ""}
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

            {/* Bouton d'envoi */}
            <Button 
              onClick={handleSubmit}
              disabled={mutation.isPending || characterCount < 5}
              className="w-full flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <span className="animate-pulse">Envoi en cours...</span>
              ) : mutation.isSuccess ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Merci pour votre feedback!
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
        );
      default:
        return null;
    }
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
        className="max-w-[600px] p-5 lg:p-8"
      >
        <div className="flex flex-col relative">
          <button 
            onClick={closeModal} 
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fermer"
          >
            <X className="size-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-4">
            <MessageSquare className="size-5" /> Votre Feedback
          </h2>
         
          {renderStepContent()}
        </div>
      </Modal>
    </>
  );
}