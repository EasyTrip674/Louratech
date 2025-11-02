/**
 * Satisfaction sentiment selector
 */

import React from 'react';
import { FeedbackSatisfaction } from '../hooks/useFeedbackForm';
import { sentimentOptions } from '../config/feedbackConfig';

export interface SatisfactionSelectorProps {
  selected: FeedbackSatisfaction;
  onSelect: (satisfaction: FeedbackSatisfaction) => void;
}

/**
 * Sentiment/satisfaction selector
 */
export const SatisfactionSelector: React.FC<SatisfactionSelectorProps> = ({
  selected,
  onSelect
}) => {
  return (
    <div className="space-y-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
      <label className="block text-sm font-semibold text-purple-700">
        Comment vous sentez-vous par rapport à notre service ?
      </label>
      <div className="flex gap-4 justify-center">
        {sentimentOptions.map((sentiment) => (
          <button
            key={sentiment.id}
            onClick={() => onSelect(sentiment.id)}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
              selected === sentiment.id
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
  );
};
