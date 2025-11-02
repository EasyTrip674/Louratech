"use client"

import React, { useState, useEffect } from "react";
import { 
  HelpCircle, Send, X, MessageSquare, AlertCircle, 
  Lightbulb, HelpingHand, Star, ThumbsUp, ThumbsDown,
  ArrowLeft, Check, Loader2, ChevronRight
} from "lucide-react";

// Types définis correctement
enum FeedbackType {
  BUG = 'BUG',
  SUGGESTION = 'SUGGESTION', 
  QUESTION = 'QUESTION',
  OTHER = 'OTHER'
}

enum FeedbackSatisfaction {
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL', 
  POSITIVE = 'POSITIVE'
}

enum FeedbackImpact {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR'
}

// Interface pour les sous-catégories
interface FeedbackSubcategory {
  id: string;
  label: string;
}

// Interface pour l'état du feedback
interface FeedbackState {
  message: string;
  type: FeedbackType;
  subtype: string;
  rating: number;
  satisfaction: FeedbackSatisfaction;
  impact: FeedbackImpact;
  isAnonymous: boolean;
  name: string;
  email: string;
}

// Interface pour les erreurs de validation
interface ValidationErrors {
  message?: string;
  name?: string;
  email?: string;
}

// Interface pour les informations de type de feedback
interface FeedbackTypeInfo {
  icon: React.ReactNode;
  helpText: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// Données de sous-catégories
const feedbackSubcategories: Record<FeedbackType, FeedbackSubcategory[]> = {
  [FeedbackType.BUG]: [
    { id: 'crash', label: 'Plantage' },
    { id: 'ui', label: 'Interface' },
    { id: 'performance', label: 'Performance' },
    { id: 'other', label: 'Autre' }
  ],
  [FeedbackType.SUGGESTION]: [
    { id: 'feature', label: 'Nouvelle fonctionnalité' },
    { id: 'improvement', label: 'Amélioration' },
    { id: 'design', label: 'Design' },
    { id: 'other', label: 'Autre' }
  ],
  [FeedbackType.QUESTION]: [
    { id: 'how-to', label: 'Comment faire' },
    { id: 'account', label: 'Mon compte' },
    { id: 'billing', label: 'Facturation' },
    { id: 'other', label: 'Autre' }
  ],
  [FeedbackType.OTHER]: [
    { id: 'compliment', label: 'Compliment' },
    { id: 'complaint', label: 'Réclamation' },
    { id: 'general', label: 'Général' },
    { id: 'other', label: 'Autre' }
  ]
};

export default function ImprovedFeedbackComponent() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
    message: "",
    type: FeedbackType.OTHER,
    subtype: "other",
    rating: 0,
    satisfaction: FeedbackSatisfaction.NEUTRAL,
    impact: FeedbackImpact.MINOR,
    isAnonymous: true,
    name: "",
    email: ""
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Animation de typing indicator
  useEffect(() => {
    if (feedback.message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [feedback.message]);

  // Validation en temps réel
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (feedback.message.length < 10) {
      errors.message = "Le message doit contenir au moins 10 caractères";
    }
    
    if (!feedback.isAnonymous && !feedback.name.trim()) {
      errors.name = "Le nom est requis";
    }
    
    if (!feedback.isAnonymous && feedback.email && !/\S+@\S+\.\S+/.test(feedback.email)) {
      errors.email = "Email invalide";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setShowThankYou(true);
      
      setTimeout(() => {
        resetForm();
        setIsOpen(false);
      }, 3000);
    }, 2000);
  };

  const resetForm = (): void => {
    setFeedback({
      message: "",
      type: FeedbackType.OTHER,
      subtype: "other", 
      rating: 0,
      satisfaction: FeedbackSatisfaction.NEUTRAL,
      impact: FeedbackImpact.MINOR,
      isAnonymous: true,
      name: "",
      email: ""
    });
    setCharacterCount(0);
    setStep(1);
    setIsSuccess(false);
    setShowThankYou(false);
    setValidationErrors({});
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value;
    setFeedback(prev => ({ ...prev, message: value }));
    setCharacterCount(value.length);
  };

  const handleTypeChange = (type: FeedbackType): void => {
    setFeedback(prev => ({ 
      ...prev, 
      type, 
      subtype: feedbackSubcategories[type][0].id,
      rating: 0,
      satisfaction: FeedbackSatisfaction.NEUTRAL,
      impact: FeedbackImpact.MINOR,
    }));
  };

  // Configuration des types de feedback
  const feedbackTypeInfo: Record<FeedbackType, FeedbackTypeInfo> = {
    [FeedbackType.BUG]: {
      icon: <AlertCircle className="w-5 h-5" />,
      helpText: "Signalez un problème que vous avez rencontré",
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    [FeedbackType.SUGGESTION]: {
      icon: <Lightbulb className="w-5 h-5" />,
      helpText: "Partagez vos idées d'amélioration", 
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    [FeedbackType.QUESTION]: {
      icon: <MessageSquare className="w-5 h-5" />,
      helpText: "Posez une question sur notre plateforme",
      color: "text-blue-500",
      bgColor: "bg-blue-50", 
      borderColor: "border-blue-200"
    },
    [FeedbackType.OTHER]: {
      icon: <HelpingHand className="w-5 h-5" />,
      helpText: "Tout autre commentaire ou retour",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  };

  // Interface pour les niveaux d'impact
  interface ImpactLevel {
    id: FeedbackImpact;
    label: string;
    desc: string;
  }

  // Interface pour les sentiments
  interface SentimentOption {
    id: FeedbackSatisfaction;
    icon: React.ComponentType<{ className?: string }> | string;
    label: string;
    color: string;
    bg: string;
  }

  // Rendu du contenu selon l'étape
  const renderStepContent = (): React.ReactNode => {
    if (showThankYou) {
      return (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Merci pour votre feedback !</h3>
          <p className="text-gray-600">Votre message a été envoyé avec succès.</p>
          <div className="flex justify-center">
            <div className="w-8 h-1 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                Comment pouvons-nous vous aider ?
              </h3>
              <p className="text-gray-600">Choisissez le type de feedback que vous souhaitez partager</p>
            </div>
            
            <div className="grid gap-3">
              {Object.values(FeedbackType).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    handleTypeChange(type);
                    setStep(2);
                  }}
                  className={`group flex items-center p-4 gap-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md`}
                >
                  <div className={`p-3 rounded-xl ${feedbackTypeInfo[type].bgColor} ${feedbackTypeInfo[type].borderColor} border group-hover:scale-110 transition-transform duration-300`}>
                    <span className={feedbackTypeInfo[type].color}>
                      {feedbackTypeInfo[type].icon}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-gray-800 capitalize mb-1">
                      {type === FeedbackType.OTHER ? "Autre" : type.toLowerCase()}
                    </h4>
                    <p className="text-sm text-gray-600">{feedbackTypeInfo[type].helpText}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Header avec navigation */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(1)} 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${feedbackTypeInfo[feedback.type].bgColor}`}>
                  <span className={feedbackTypeInfo[feedback.type].color}>
                    {feedbackTypeInfo[feedback.type].icon}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {feedback.type === FeedbackType.OTHER ? "Autre" : feedback.type.toLowerCase()}
                </h3>
              </div>
            </div>

          

            {/* Sous-catégories avec animation */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Précisez votre {feedback.type === FeedbackType.BUG ? "problème" : 
                  feedback.type === FeedbackType.SUGGESTION ? "suggestion" : 
                  feedback.type === FeedbackType.QUESTION ? "question" : "feedback"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {feedbackSubcategories[feedback.type].map((subcat, index) => (
                  <button
                    key={subcat.id}
                    onClick={() => setFeedback(prev => ({ ...prev, subtype: subcat.id }))}
                    className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                      feedback.subtype === subcat.id 
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-md" 
                        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {subcat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Évaluations spécifiques par type */}
            {feedback.type === FeedbackType.BUG && (
              <div className="space-y-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <label className="block text-sm font-semibold text-red-700">
                  Niveau d&apos;impact du problème
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: FeedbackImpact.CRITICAL, label: "🔴 Critique", desc: "Bloque complètement" },
                    { id: FeedbackImpact.MAJOR, label: "🟡 Majeur", desc: "Gêne importante" },
                    { id: FeedbackImpact.MINOR, label: "🟢 Mineur", desc: "Gêne légère" },
                  ] as ImpactLevel[]).map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setFeedback(prev => ({ ...prev, impact: level.id }))}
                      className={`p-3 text-center rounded-lg border-2 transition-all duration-200 ${
                        feedback.impact === level.id 
                          ? "border-red-300 bg-red-100 text-red-800 shadow-md transform scale-105" 
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="font-medium text-sm">{level.label}</div>
                      <div className="text-xs opacity-75 mt-1">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {feedback.type === FeedbackType.SUGGESTION && (
              <div className="space-y-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <label className="block text-sm font-semibold text-amber-700">
                  À quel point cette fonctionnalité vous serait-elle utile ?
                </label>
                <div className="flex justify-center">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                        className="p-1 focus:outline-none transition-transform duration-200 hover:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            (feedback.rating || 0) >= star 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300 hover:text-yellow-300"
                          } transition-colors`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-center text-sm text-amber-600 font-medium">
                  {feedback.rating === 0 && "Cliquez pour noter"}
                  {feedback.rating === 1 && "😐 Pas vraiment utile"}
                  {feedback.rating === 2 && "🤔 Peu utile"}
                  {feedback.rating === 3 && "😊 Assez utile"}
                  {feedback.rating === 4 && "😍 Très utile"}
                  {feedback.rating === 5 && "🤩 Indispensable !"}
                </p>
              </div>
            )}

            {feedback.type === FeedbackType.OTHER && (
              <div className="space-y-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <label className="block text-sm font-semibold text-purple-700">
                  Comment vous sentez-vous par rapport à notre service ?
                </label>
                <div className="flex gap-4 justify-center">
                  {([
                    { id: FeedbackSatisfaction.NEGATIVE, icon: ThumbsDown, label: 'Insatisfait', color: 'text-red-500', bg: 'bg-red-50' },
                    { id: FeedbackSatisfaction.NEUTRAL, icon: '😐', label: 'Neutre', color: 'text-gray-500', bg: 'bg-gray-50' },
                    { id: FeedbackSatisfaction.POSITIVE, icon: ThumbsUp, label: 'Satisfait', color: 'text-green-500', bg: 'bg-green-50' }
                  ] as SentimentOption[]).map((sentiment) => (
                    <button
                      key={sentiment.id}
                      onClick={() => setFeedback(prev => ({ ...prev, satisfaction: sentiment.id }))}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                        feedback.satisfaction === sentiment.id 
                          ? `${sentiment.bg} border-current ${sentiment.color} shadow-md scale-105` 
                          : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {typeof sentiment.icon === 'string' ? (
                        <span className="text-2xl">{sentiment.icon}</span>
                      ) : (
                        <sentiment.icon className="w-6 h-6" />
                      )}
                      <span className="text-sm font-medium mt-2">{sentiment.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Zone de message améliorée */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Décrivez-nous votre expérience
              </label>
              <div className="relative">
                <textarea
                  value={feedback.message}
                  onChange={handleMessageChange}
                  placeholder={
                    feedback.type === FeedbackType.BUG ? "Décrivez précisément le problème : quand est-il survenu ? Que faisiez-vous ?" :
                    feedback.type === FeedbackType.SUGGESTION ? "Expliquez votre idée : quel problème résoudrait-elle ? Comment l'imaginez-vous ?" :
                    feedback.type === FeedbackType.QUESTION ? "Posez votre question de manière détaillée..." :
                    "Partagez vos commentaires, suggestions ou impressions..."
                  }
                  className={`w-full h-32 p-4 border-2 rounded-xl resize-none transition-all duration-300 focus:outline-none ${
                    validationErrors.message 
                      ? "border-red-300 bg-red-50 focus:border-red-400" 
                      : feedback.message.length >= 10 
                        ? "border-green-300 bg-green-50 focus:border-green-400" 
                        : "border-gray-200 bg-white focus:border-blue-400 focus:bg-blue-50"
                  }`}
                  disabled={isSubmitting}
                />
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-blue-500">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs ml-1">saisie en cours...</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${
                  validationErrors.message ? "text-red-500" : 
                  characterCount < 10 ? "text-orange-500" : "text-green-600"
                }`}>
                  {validationErrors.message || 
                   (characterCount < 10 ? `${10 - characterCount} caractères minimum requis` : 
                    "✓ Message suffisamment détaillé")}
                </span>
                <span className={`text-sm font-medium ${
                  characterCount === 0 ? "text-gray-400" :
                  characterCount < 10 ? "text-orange-500" :
                  "text-green-600"
                }`}>
                  {characterCount}/500
                </span>
              </div>
            </div>

            {/* Section anonymat avec toggle amélioré */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Mode anonyme</span>
                  <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {feedback.isAnonymous ? "🔒 Anonyme" : "👤 Identifié"}
                  </div>
                </div>
                <button
                  onClick={() => setFeedback(prev => ({ 
                    ...prev, 
                    isAnonymous: !prev.isAnonymous,
                    name: prev.isAnonymous ? "" : prev.name,
                    email: prev.isAnonymous ? "" : prev.email
                  }))}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    feedback.isAnonymous ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    feedback.isAnonymous ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {!feedback.isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                  <div>
                    <input
                      type="text"
                      value={feedback.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedback(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Votre nom"
                      className={`w-full p-3 border-2 rounded-lg transition-all ${
                        validationErrors.name ? "border-red-300" : "border-gray-200 focus:border-blue-400 focus:bg-blue-50"
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <input 
                      type="email"
                      value={feedback.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Votre email (optionnel)"
                      className={`w-full p-3 border-2 rounded-lg transition-all ${
                        validationErrors.email ? "border-red-300" : "border-gray-200 focus:border-blue-400 focus:bg-blue-50"
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bouton d'envoi amélioré */}
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || characterCount < 10 || Object.keys(validationErrors).length > 0}
              className={`w-full p-4 rounded-xl font-semibold transition-all duration-300 transform ${
                isSubmitting || characterCount < 10 || Object.keys(validationErrors).length > 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : isSuccess 
                    ? "bg-green-500 text-white hover:bg-green-600 hover:scale-105 shadow-lg" 
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Envoi en cours...</span>
                </div>
              ) : isSuccess ? (
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Feedback envoyé !</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  <span>Envoyer mon feedback</span>
                </div>
              )}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Bouton flottant amélioré */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          <HelpCircle className="w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            !
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Donnez-nous votre avis
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>

      {/* Modal améliorée */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dark:text-black bg-opacity-50 backdrop-blur-sm ">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="sticky top-0 border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Votre Feedback</h2>
              </div>
              
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(resetForm, 300);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              {renderStepContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}