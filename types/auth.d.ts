// types/auth.ts
export type Authorization = {
    id: string;
    created_at: string;
    updated_at: string;
    user: string;
    can_change_user_authorization: boolean;
    can_change_user_password: boolean;
    can_create_admin: boolean;
    can_create_client: boolean;
    can_create_client_document: boolean;
    can_create_client_procedure: boolean;
    can_create_client_step: boolean;
    can_create_compta_settings: boolean;
    can_create_expense: boolean;
    can_create_invoice: boolean;
    can_create_organization: boolean;
    can_create_procedure: boolean;
    can_create_revenue: boolean;
    can_create_step: boolean;
    can_create_transaction: boolean;
    can_delete_admin: boolean;
    can_delete_client: boolean;
    can_delete_client_document: boolean;
    can_delete_client_procedure: boolean;
    can_delete_client_step: boolean;
    can_delete_compta_settings: boolean;
    can_delete_expense: boolean;
    can_delete_invoice: boolean;
    can_delete_organization: boolean;
    can_delete_procedure: boolean;
    can_delete_revenue: boolean;
    can_delete_step: boolean;
    can_delete_transaction: boolean;
    can_edit_admin: boolean;
    can_edit_client: boolean;
    can_edit_client_document: boolean;
    can_edit_client_procedure: boolean;
    can_edit_client_step: boolean;
    can_edit_compta_settings: boolean;
    can_edit_expense: boolean;
    can_edit_invoice: boolean;
    can_edit_organization: boolean;
    can_edit_procedure: boolean;
    can_edit_revenue: boolean;
    can_edit_step: boolean;
    can_edit_transaction: boolean;
    can_read_admin: boolean;
    can_read_client: boolean;
    can_read_client_document: boolean;
    can_read_client_procedure: boolean;
    can_read_client_step: boolean;
    can_read_compta_settings: boolean;
    can_read_expense: boolean;
    can_read_invoice: boolean;
    can_read_organization: boolean;
    can_read_procedure: boolean;
    can_read_revenue: boolean;
    can_read_step: boolean;
    can_read_transaction: boolean;
  };
  
  export type Organization = {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
  };
  
  export type ComptaSettings = {
    fiscal_year: string;
    tax_identification?: string | null;
    currency: string;
    default_tax_rate?: number | null;
    invoice_prefix?: string | null;
    invoice_number_format?: string | null;
  };

  export type User = {
    id: string;
    email: string;
    email_verified: boolean;
    first_name: string;
    last_name: string;
    name: string;
    image: string | null;
    last_login: string | null;
    is_staff: boolean;
    is_superuser: boolean;
    active: boolean;
    role: string; // ADMIN, USER, etc.
    groups: string[];
    user_permissions: string[];
    created_at: string;
    updated_at: string;
    authorization: Authorization;
    organization: Organization;
    compta_settings: ComptaSettings
  };
  