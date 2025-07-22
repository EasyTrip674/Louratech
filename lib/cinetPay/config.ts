import { CinetPayConfig } from "./types";


export const cinetPayConfig: CinetPayConfig = {
    apiKey: process.env.CINETPAY_API_KEY!,
    siteId: process.env.CINETPAY_SITE_ID!,
    secretKey: process.env.CINETPAY_SECRET_KEY!,
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api-checkout.cinetpay.com'
      : 'https://api-checkout-sandbox.cinetpay.com'
  };
  