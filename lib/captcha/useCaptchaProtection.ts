'use client';

import { useState, useCallback } from 'react';
import { useCaptcha } from './CaptchaProvider';

export const useCaptchaProtection = () => {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { executeRecaptcha } = useCaptcha();

  const checkCaptchaRequired = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/captcha/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      return data.requiresCaptcha;
    } catch (error) {
      console.error('Erreur lors de la vérification CAPTCHA:', error);
      return false;
    }
  }, []);

  const verifyCaptchaToken = useCallback(async (token: string): Promise<boolean> => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/captcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const executeWithProtection = useCallback(async (
    action: () => Promise<void> | void,
    actionName: string = 'submit'
  ): Promise<void> => {
    const requiresCaptcha = await checkCaptchaRequired();
    
    if (requiresCaptcha) {
      setShowCaptcha(true);
      return new Promise((resolve, reject) => {
        const handleVerify = async (token: string) => {
          const isValid = await verifyCaptchaToken(token);
          if (isValid) {
            setShowCaptcha(false);
            try {
              await action();
              resolve();
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('Vérification CAPTCHA échouée'));
          }
        };

        // Cette fonction sera appelée par le modal
        (window as any).handleCaptchaVerify = handleVerify;
      });
    } else {
      await action();
    }
  }, [checkCaptchaRequired, verifyCaptchaToken]);

  return {
    showCaptcha,
    setShowCaptcha,
    isVerifying,
    executeWithProtection,
    verifyCaptchaToken,
  };
};