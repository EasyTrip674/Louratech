/**
 * Submit button with loading states
 */

import React from 'react';
import { Send, Check, Loader2 } from 'lucide-react';

export interface SubmitButtonProps {
  isSubmitting: boolean;
  isSuccess: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
}

/**
 * Feedback submit button with states
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  isSuccess,
  isDisabled,
  onSubmit
}) => {
  return (
    <button
      onClick={onSubmit}
      disabled={isDisabled}
      className={`w-full p-4 rounded-xl font-semibold transition-all duration-300 transform ${
        isDisabled
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
  );
};
