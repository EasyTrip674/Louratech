/**
 * Custom hook for managing feedback form state
 */

import { useState, useEffect } from 'react';

// Types
export enum FeedbackType {
  BUG = 'BUG',
  SUGGESTION = 'SUGGESTION',
  QUESTION = 'QUESTION',
  OTHER = 'OTHER'
}

export enum FeedbackSatisfaction {
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL',
  POSITIVE = 'POSITIVE'
}

export enum FeedbackImpact {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR'
}

export interface FeedbackState {
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

export interface ValidationErrors {
  message?: string;
  name?: string;
  email?: string;
}

const initialState: FeedbackState = {
  message: "",
  type: FeedbackType.OTHER,
  subtype: "other",
  rating: 0,
  satisfaction: FeedbackSatisfaction.NEUTRAL,
  impact: FeedbackImpact.MINOR,
  isAnonymous: true,
  name: "",
  email: ""
};

/**
 * Hook for managing feedback form state and validation
 */
export function useFeedbackForm() {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackState>(initialState);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Typing indicator effect
  useEffect(() => {
    if (feedback.message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [feedback.message]);

  // Validation function
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

  // Submit handler
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
      }, 3000);
    }, 2000);
  };

  // Reset form
  const resetForm = (): void => {
    setFeedback(initialState);
    setCharacterCount(0);
    setStep(1);
    setIsSuccess(false);
    setShowThankYou(false);
    setValidationErrors({});
  };

  // Update message
  const handleMessageChange = (value: string): void => {
    setFeedback(prev => ({ ...prev, message: value }));
    setCharacterCount(value.length);
  };

  // Update type
  const handleTypeChange = (type: FeedbackType): void => {
    setFeedback(prev => ({
      ...prev,
      type,
      subtype: "other",
      rating: 0,
      satisfaction: FeedbackSatisfaction.NEUTRAL,
      impact: FeedbackImpact.MINOR,
    }));
  };

  // Update field
  const updateField = <K extends keyof FeedbackState>(field: K, value: FeedbackState[K]): void => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  return {
    step,
    setStep,
    isSubmitting,
    isSuccess,
    showThankYou,
    feedback,
    validationErrors,
    characterCount,
    isTyping,
    handleSubmit,
    resetForm,
    handleMessageChange,
    handleTypeChange,
    updateField,
    setFeedback
  };
}
