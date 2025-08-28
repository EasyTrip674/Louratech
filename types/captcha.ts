export interface CaptchaConfig {
    siteKey: string;
    secretKey: string;
    threshold: number;
    enabled: boolean;
  }
  
  export interface CaptchaResponse {
    success: boolean;
    score?: number;
    'error-codes'?: string[];
  }
  