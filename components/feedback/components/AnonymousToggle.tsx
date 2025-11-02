/**
 * Anonymous mode toggle with contact fields
 */

import React from 'react';
import { FeedbackState, ValidationErrors } from '../hooks/useFeedbackForm';

export interface AnonymousToggleProps {
  feedback: FeedbackState;
  validationErrors: ValidationErrors;
  onToggle: () => void;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
}

/**
 * Toggle for anonymous mode with conditional contact fields
 */
export const AnonymousToggle: React.FC<AnonymousToggleProps> = ({
  feedback,
  validationErrors,
  onToggle,
  onNameChange,
  onEmailChange
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Mode anonyme</span>
          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            {feedback.isAnonymous ? "🔒 Anonyme" : "👤 Identifié"}
          </div>
        </div>
        <button
          onClick={onToggle}
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
              onChange={(e) => onNameChange(e.target.value)}
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
              onChange={(e) => onEmailChange(e.target.value)}
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
  );
};
