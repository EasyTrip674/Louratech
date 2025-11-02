/**
 * Configuration for feedback component
 */

import {
  AlertCircle,
  Lightbulb,
  MessageSquare,
  HelpingHand,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { FeedbackType, FeedbackSatisfaction, FeedbackImpact } from '../hooks/useFeedbackForm';

export interface FeedbackSubcategory {
  id: string;
  label: string;
}

export interface FeedbackTypeInfo {
  icon: React.ComponentType<{ className?: string }>;
  helpText: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface ImpactLevel {
  id: FeedbackImpact;
  label: string;
  desc: string;
}

export interface SentimentOption {
  id: FeedbackSatisfaction;
  icon: React.ComponentType<{ className?: string }> | string;
  label: string;
  color: string;
  bg: string;
}

/**
 * Subcategories for each feedback type
 */
export const feedbackSubcategories: Record<FeedbackType, FeedbackSubcategory[]> = {
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

/**
 * Type information and styling
 */
export const feedbackTypeInfo: Record<FeedbackType, FeedbackTypeInfo> = {
  [FeedbackType.BUG]: {
    icon: AlertCircle,
    helpText: "Signalez un problème que vous avez rencontré",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  [FeedbackType.SUGGESTION]: {
    icon: Lightbulb,
    helpText: "Partagez vos idées d'amélioration",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  [FeedbackType.QUESTION]: {
    icon: MessageSquare,
    helpText: "Posez une question sur notre plateforme",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  [FeedbackType.OTHER]: {
    icon: HelpingHand,
    helpText: "Tout autre commentaire ou retour",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  }
};

/**
 * Impact levels for bug reports
 */
export const impactLevels: ImpactLevel[] = [
  { id: FeedbackImpact.CRITICAL, label: "🔴 Critique", desc: "Bloque complètement" },
  { id: FeedbackImpact.MAJOR, label: "🟡 Majeur", desc: "Gêne importante" },
  { id: FeedbackImpact.MINOR, label: "🟢 Mineur", desc: "Gêne légère" },
];

/**
 * Sentiment options
 */
export const sentimentOptions: SentimentOption[] = [
  { id: FeedbackSatisfaction.NEGATIVE, icon: ThumbsDown, label: 'Insatisfait', color: 'text-red-500', bg: 'bg-red-50' },
  { id: FeedbackSatisfaction.NEUTRAL, icon: '😐', label: 'Neutre', color: 'text-gray-500', bg: 'bg-gray-50' },
  { id: FeedbackSatisfaction.POSITIVE, icon: ThumbsUp, label: 'Satisfait', color: 'text-green-500', bg: 'bg-green-50' }
];

/**
 * Rating descriptions
 */
export const ratingDescriptions: Record<number, string> = {
  0: "Cliquez pour noter",
  1: "😐 Pas vraiment utile",
  2: "🤔 Peu utile",
  3: "😊 Assez utile",
  4: "😍 Très utile",
  5: "🤩 Indispensable !"
};

/**
 * Placeholder text for message textarea
 */
export const getMessagePlaceholder = (type: FeedbackType): string => {
  switch (type) {
    case FeedbackType.BUG:
      return "Décrivez précisément le problème : quand est-il survenu ? Que faisiez-vous ?";
    case FeedbackType.SUGGESTION:
      return "Expliquez votre idée : quel problème résoudrait-elle ? Comment l'imaginez-vous ?";
    case FeedbackType.QUESTION:
      return "Posez votre question de manière détaillée...";
    default:
      return "Partagez vos commentaires, suggestions ou impressions...";
  }
};
