import axios from 'axios';
  import { cinetPayConfig } from './config';
  import { CinetPayPaymentRequest, CinetPayPaymentResponse } from './types';
  
  export class CinetPayClient {
    private baseURL: string;
    private apiKey: string;
    private siteId: string;
  
    constructor() {
      this.baseURL = cinetPayConfig.baseUrl;
      this.apiKey = cinetPayConfig.apiKey;
      this.siteId = cinetPayConfig.siteId;
    }
  
    async createPayment(paymentData: CinetPayPaymentRequest): Promise<CinetPayPaymentResponse> {
      try {
        const payload = {
          apikey: this.apiKey,
          site_id: this.siteId,
          ...paymentData
        };
  
        const response = await axios.post(
          `${this.baseURL}/v2/?method=payLink`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000
          }
        );
  
        return response.data;
      } catch (error) {
        console.error('CinetPay payment creation error:', error);
        throw new Error('Failed to create CinetPay payment');
      }
    }
  
    async checkPaymentStatus(transactionId: string): Promise<any> {
      try {
        const payload = {
          apikey: this.apiKey,
          site_id: this.siteId,
          transaction_id: transactionId
        };
  
        const response = await axios.post(
          `${this.baseURL}/v2/?method=checkPayStatus`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000
          }
        );
  
        return response.data;
      } catch (error) {
        console.error('CinetPay status check error:', error);
        throw new Error('Failed to check payment status');
      }
    }
  }