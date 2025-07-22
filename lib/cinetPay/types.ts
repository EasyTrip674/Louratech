// lib/cinetpay/types.ts
export interface CinetPayConfig {
    apiKey: string;
    siteId: string;
    secretKey: string;
    baseUrl: string;
  }
  
  export interface CinetPayPaymentRequest {
    amount: number;
    currency: string;
    transaction_id: string;
    description: string;
    return_url: string;
    notify_url: string;
    customer_name?: string;
    customer_surname?: string;
    customer_email?: string;
    customer_phone_number?: string;
    customer_address?: string;
    customer_city?: string;
    customer_country?: string;
    customer_state?: string;
    customer_zip_code?: string;
    channels?: string;
    metadata?: string;
    lang?: string;
  }
  
  export interface CinetPayPaymentResponse {
    code: string;
    message: string;
    description: string;
    data: {
      payment_token: string;
      payment_url: string;
    };
  }
  
  export interface CinetPayCallbackData {
    cpm_site_id: string;
    signature: string;
    cpm_amount: string;
    cpm_currency: string;
    cpm_custom: string;
    cpm_language: string;
    cpm_page_action: string;
    cpm_payment_config: string;
    cpm_payment_method: string;
    cpm_phone_prefixe: string;
    cpm_phone_num: string;
    cpm_country: string;
    cpm_designation: string;
    cpm_site_name: string;
    cpm_trans_id: string;
    cpm_trans_status: string;
    cpm_result: string;
    cpm_trans_date: string;
    cpm_order_id: string;
    cel_phone_num: string;
    cpm_phone_operator: string;
    cpm_ipn_ack: string;
    created_at: string;
    updated_at: string;
    cpm_error_message?: string;
  }
  
  // lib/cinetpay/config.ts
  
  // lib/cinetpay/utils.ts
  
  // lib/cinetpay/client.ts
  