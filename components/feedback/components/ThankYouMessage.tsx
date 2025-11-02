/**
 * Thank you message after successful submission
 */

import React from 'react';
import { Check } from 'lucide-react';

/**
 * Success/thank you screen
 */
export const ThankYouMessage: React.FC = () => {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">Merci pour votre feedback !</h3>
      <p className="text-gray-600">Votre message a été envoyé avec succès.</p>
      <div className="flex justify-center">
        <div className="w-8 h-1 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};
