/**
 * Impact level selector for bug reports
 */

import React from 'react';
import { FeedbackImpact } from '../hooks/useFeedbackForm';
import { impactLevels } from '../config/feedbackConfig';

export interface BugImpactSelectorProps {
  selectedImpact: FeedbackImpact;
  onSelect: (impact: FeedbackImpact) => void;
}

/**
 * Impact level selector for bugs
 */
export const BugImpactSelector: React.FC<BugImpactSelectorProps> = ({
  selectedImpact,
  onSelect
}) => {
  return (
    <div className="space-y-3 p-4 bg-red-50 rounded-xl border border-red-100">
      <label className="block text-sm font-semibold text-red-700">
        Niveau d&apos;impact du problème
      </label>
      <div className="grid grid-cols-3 gap-2">
        {impactLevels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={`p-3 text-center rounded-lg border-2 transition-all duration-200 ${
              selectedImpact === level.id
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
  );
};
