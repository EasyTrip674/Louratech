/**
 * Message textarea with validation and character count
 */

import React from 'react';
import { FeedbackType } from '../hooks/useFeedbackForm';
import { getMessagePlaceholder } from '../config/feedbackConfig';
import { ValidationErrors } from '../hooks/useFeedbackForm';

export interface MessageTextareaProps {
  value: string;
  feedbackType: FeedbackType;
  characterCount: number;
  isTyping: boolean;
  isSubmitting: boolean;
  validationErrors: ValidationErrors;
  onChange: (value: string) => void;
}

/**
 * Textarea for feedback message with validation
 */
export const MessageTextarea: React.FC<MessageTextareaProps> = ({
  value,
  feedbackType,
  characterCount,
  isTyping,
  isSubmitting,
  validationErrors,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Décrivez-nous votre expérience
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={getMessagePlaceholder(feedbackType)}
          className={`w-full h-32 p-4 border-2 rounded-xl resize-none transition-all duration-300 focus:outline-none ${
            validationErrors.message
              ? "border-red-300 bg-red-50 focus:border-red-400"
              : value.length >= 10
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
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
  );
};
