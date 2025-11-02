/**
 * Step 2: Main feedback form
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { FeedbackState, FeedbackType, ValidationErrors } from '../hooks/useFeedbackForm';
import { feedbackTypeInfo } from '../config/feedbackConfig';
import { SubcategorySelector } from './SubcategorySelector';
import { BugImpactSelector } from './BugImpactSelector';
import { StarRating } from './StarRating';
import { SatisfactionSelector } from './SatisfactionSelector';
import { MessageTextarea } from './MessageTextarea';
import { AnonymousToggle } from './AnonymousToggle';
import { SubmitButton } from './SubmitButton';

export interface FeedbackFormStepProps {
  feedback: FeedbackState;
  validationErrors: ValidationErrors;
  characterCount: number;
  isTyping: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  onBack: () => void;
  onSubmit: () => void;
  onMessageChange: (value: string) => void;
  updateField: <K extends keyof FeedbackState>(field: K, value: FeedbackState[K]) => void;
}

/**
 * Main form step with all feedback fields
 */
export const FeedbackFormStep: React.FC<FeedbackFormStepProps> = ({
  feedback,
  validationErrors,
  characterCount,
  isTyping,
  isSubmitting,
  isSuccess,
  onBack,
  onSubmit,
  onMessageChange,
  updateField
}) => {
  const typeInfo = feedbackTypeInfo[feedback.type];
  const isDisabled = isSubmitting || characterCount < 10 || Object.keys(validationErrors).length > 0;

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
            {React.createElement(typeInfo.icon, {
              className: `w-5 h-5 ${typeInfo.color}`
            })}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {feedback.type === FeedbackType.OTHER ? "Autre" : feedback.type.toLowerCase()}
          </h3>
        </div>
      </div>

      {/* Subcategories */}
      <SubcategorySelector
        feedbackType={feedback.type}
        selectedSubtype={feedback.subtype}
        onSelect={(subtype) => updateField('subtype', subtype)}
      />

      {/* Type-specific sections */}
      {feedback.type === FeedbackType.BUG && (
        <BugImpactSelector
          selectedImpact={feedback.impact}
          onSelect={(impact) => updateField('impact', impact)}
        />
      )}

      {feedback.type === FeedbackType.SUGGESTION && (
        <StarRating
          rating={feedback.rating}
          onRate={(rating) => updateField('rating', rating)}
        />
      )}

      {feedback.type === FeedbackType.OTHER && (
        <SatisfactionSelector
          selected={feedback.satisfaction}
          onSelect={(satisfaction) => updateField('satisfaction', satisfaction)}
        />
      )}

      {/* Message textarea */}
      <MessageTextarea
        value={feedback.message}
        feedbackType={feedback.type}
        characterCount={characterCount}
        isTyping={isTyping}
        isSubmitting={isSubmitting}
        validationErrors={validationErrors}
        onChange={onMessageChange}
      />

      {/* Anonymous toggle */}
      <AnonymousToggle
        feedback={feedback}
        validationErrors={validationErrors}
        onToggle={() => updateField('isAnonymous', !feedback.isAnonymous)}
        onNameChange={(name) => updateField('name', name)}
        onEmailChange={(email) => updateField('email', email)}
      />

      {/* Submit button */}
      <SubmitButton
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        isDisabled={isDisabled}
        onSubmit={onSubmit}
      />
    </div>
  );
};
