/**
 * Star rating component for suggestions
 */

import React from 'react';
import { Star } from 'lucide-react';
import { ratingDescriptions } from '../config/feedbackConfig';

export interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
}

/**
 * 5-star rating selector
 */
export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate }) => {
  return (
    <div className="space-y-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
      <label className="block text-sm font-semibold text-amber-700">
        À quel point cette fonctionnalité vous serait-elle utile ?
      </label>
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRate(star)}
              className="p-1 focus:outline-none transition-transform duration-200 hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  rating >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 hover:text-yellow-300"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-sm text-amber-600 font-medium">
        {ratingDescriptions[rating] || ratingDescriptions[0]}
      </p>
    </div>
  );
};
