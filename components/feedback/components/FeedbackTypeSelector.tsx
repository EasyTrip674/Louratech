/**
 * Step 1: Feedback type selection
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { FeedbackType } from '../hooks/useFeedbackForm';
import { feedbackTypeInfo } from '../config/feedbackConfig';

export interface FeedbackTypeSelectorProps {
  onSelect: (type: FeedbackType) => void;
}

/**
 * Grid of feedback type options
 */
export const FeedbackTypeSelector: React.FC<FeedbackTypeSelectorProps> = ({ onSelect }) => {
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
            onClick={() => onSelect(type)}
            className="group flex items-center p-4 gap-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className={`p-3 rounded-xl ${feedbackTypeInfo[type].bgColor} ${feedbackTypeInfo[type].borderColor} border group-hover:scale-110 transition-transform duration-300`}>
              {React.createElement(feedbackTypeInfo[type].icon, {
                className: `w-5 h-5 ${feedbackTypeInfo[type].color}`
              })}
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
};
