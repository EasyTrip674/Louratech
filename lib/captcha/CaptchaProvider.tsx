'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface CaptchaContextType {
  isLoaded: boolean;
  executeRecaptcha: (action: string) => Promise<string | null>;
}

const CaptchaContext = createContext<CaptchaContextType>({
  isLoaded: false,
  executeRecaptcha: async () => null,
});

export const useCaptcha = () => useContext(CaptchaContext);

interface CaptchaProviderProps {
  children: React.ReactNode;
  siteKey: string;
}

export const CaptchaProvider: React.FC<CaptchaProviderProps> = ({ children, siteKey }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!siteKey) return;

    // Charge le script reCAPTCHA
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      // Vérifier si l'élément existe avant de le supprimer
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [siteKey]);

  const executeRecaptcha = async (action: string): Promise<string | null> => {
    if (!isLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA pas encore chargé');
      return null;
    }

    try {
      return await window.grecaptcha.execute(siteKey, { action });
    } catch (error) {
      console.error('Erreur lors de l\'exécution de reCAPTCHA:', error);
      return null;
    }
  };

  return (
    <CaptchaContext.Provider value={{ isLoaded, executeRecaptcha }}>
      {children}
    </CaptchaContext.Provider>
  );
};
