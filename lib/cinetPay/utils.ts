import crypto from 'crypto';
  import { cinetPayConfig } from './config';
import { CinetPayCallbackData } from './types';
  
  export function generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `TXN_${timestamp}_${random}`.toUpperCase();
  }
  
  export function generateSignature(data: Record<string, any>): string {
    const sortedKeys = Object.keys(data).sort();
    const concatenatedValues = sortedKeys.map(key => data[key]).join('');
    const stringToSign = concatenatedValues + cinetPayConfig.secretKey;
    return crypto.createHash('sha256').update(stringToSign).digest('hex');
  }
  
  export function verifySignature(data: CinetPayCallbackData): boolean {
    const { signature, ...payloadData } = data;
    const calculatedSignature = generateSignature(payloadData);
    return signature === calculatedSignature;
  }
  
  export function formatAmount(amount: number): number {
    // CinetPay expects amount in the smallest unit (e.g., centimes for EUR)
    return Math.round(amount * 100);
  }
  
  export function parseAmount(amount: string): number {
    return parseFloat(amount) / 100;
  }
  