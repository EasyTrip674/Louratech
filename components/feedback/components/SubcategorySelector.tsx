/**
 * Subcategory selection component
 */

import React from 'react';
import { feedbackSubcategories } from '../config/feedbackConfig';
import { FeedbackType } from '../hooks/useFeedbackForm';

export interface SubcategorySelectorProps {
  feedbackType: FeedbackType;
  selectedSubtype: string;
  onSelect: (subtype: string) => void;
}

/**
 * Grid of subcategory buttons
 */
export const SubcategorySelector: React.FC<SubcategorySelectorProps> = ({
  feedbackType,
  selectedSubtype,
  onSelect
}) => {
  const getLabel = (type: FeedbackType): string => {
    switch (type) {
      case FeedbackType.BUG: return "problème";
      case FeedbackType.SUGGESTION: return "suggestion";
      case FeedbackType.QUESTION: return "question";
      default: return "feedback";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Précisez votre {getLabel(feedbackType)}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {feedbackSubcategories[feedbackType].map((subcat, index) => (
          <button
            key={subcat.id}
            onClick={() => onSelect(subcat.id)}
            className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
              selectedSubtype === subcat.id
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
  );
};
