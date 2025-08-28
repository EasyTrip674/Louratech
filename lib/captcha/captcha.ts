import { CaptchaConfig, CaptchaResponse } from '@/types/captcha';

export class CaptchaProtection {
  private config: CaptchaConfig;
  private requestCounts: Map<string, { count: number; lastReset: number }> = new Map();
  
  constructor(config: CaptchaConfig) {
    this.config = config;
  }

  // Vérifie si le CAPTCHA doit être affiché
  shouldShowCaptcha(clientIP: string, userAgent?: string): boolean {
    if (!this.config.enabled) return false;

    const key = `${clientIP}-${userAgent || 'unknown'}`;
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;

    const userRequests = this.requestCounts.get(key);
    
    if (!userRequests) {
      this.requestCounts.set(key, { count: 1, lastReset: now });
      return false;
    }

    // Reset le compteur toutes les heures
    if (now - userRequests.lastReset > hourInMs) {
      this.requestCounts.set(key, { count: 1, lastReset: now });
      return false;
    }

    // Affiche le CAPTCHA après 5 requêtes par heure
    userRequests.count++;
    return userRequests.count > 5;
  }

  // Vérifie le token CAPTCHA côté serveur
  async verifyCaptcha(token: string, clientIP: string): Promise<CaptchaResponse> {
    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: this.config.secretKey,
          response: token,
          remoteip: clientIP,
        }),
      });

      const result = await response.json() as CaptchaResponse;
      
      // Vérifie le score pour reCAPTCHA v3
      if (result.success && result.score !== undefined) {
        result.success = result.score >= this.config.threshold;
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la vérification CAPTCHA:', error);
      return { success: false, 'error-codes': ['network-error'] };
    }
  }
}

// Singleton instance
const captchaConfig: CaptchaConfig = {
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
  threshold: 0.5,
  enabled: process.env.NODE_ENV === 'production',
};

export const captchaProtection = new CaptchaProtection(captchaConfig);
