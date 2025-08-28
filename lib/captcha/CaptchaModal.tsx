'use client';

import React, { useState, useEffect } from 'react';
import { useCaptcha } from './CaptchaProvider';

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (token: string) => void;
  title?: string;
  message?: string;
}

export const CaptchaModal: React.FC<CaptchaModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  title = 'Vérification de sécurité',
  message = 'Veuillez confirmer que vous n\'êtes pas un robot',
}) => {
  const { isLoaded, executeRecaptcha } = useCaptcha();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isLoaded) {
      handleVerify();
    }
  }, [isOpen, isLoaded]);

  const handleVerify = async () => {
    if (!executeRecaptcha) return;

    setIsVerifying(true);
    setError(null);

    try {
      const token = await executeRecaptcha('submit');
      if (token) {
        onVerify(token);
      } else {
        setError('Échec de la vérification. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          
          {isVerifying && (
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Vérification en cours...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              disabled={isVerifying}
            >
              Annuler
            </button>
            {error && (
              <button
                onClick={handleVerify}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isVerifying}
              >
                Réessayer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
