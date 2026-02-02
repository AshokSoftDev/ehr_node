// Billing Types

export interface CreateInvoiceItemDto {
  item_type: 'drug' | 'procedure' | 'package' | 'custom';
  item_name: string;
  reference_id?: number | null;
  quantity?: number;
  unit_amount?: number;
  premium?: number;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  tax_applicable?: boolean;
  notes?: string | null;
  assigned_user?: string | null;
}


export interface UpdateInvoiceItemDto extends Partial<CreateInvoiceItemDto> {
  item_id?: number;
}

export interface CreateInvoiceDto {
  patient_id: number;
  visit_id: number;
  items: CreateInvoiceItemDto[];
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  coupon_code?: string;
  discount_reason?: string;
  invoice_date?: Date;
  due_date?: Date;
  notes?: string;
}

export interface UpdateInvoiceDto {
  items?: UpdateInvoiceItemDto[];
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  coupon_code?: string;
  discount_reason?: string;
  invoice_date?: Date;
  due_date?: Date;
  notes?: string;
  status?: 'draft' | 'sent' | 'paid' | 'cancelled';
}

export interface InvoiceFilters {
  patient_id?: number;
  visit_id?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateReceiptDto {
  invoice_id: number;
  patient_id: number;
  amount: number;
  payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
  payment_date?: Date;
  notes?: string;
}

export interface UpdateReceiptDto {
  amount?: number;
  payment_method?: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
  payment_date?: Date;
  notes?: string;
}

export interface ReceiptFilters {
  invoice_id?: number;
  patient_id?: number;
  payment_method?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Calculated item with amounts
export interface CalculatedInvoiceItem {
  item_type: string;
  item_name: string;
  reference_id?: number | null;
  quantity: number;
  unit_amount: number;
  premium: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
  tax_applicable: boolean;
  net_amount: number;
  notes?: string | null;
  assigned_user?: string | null;
}


// Calculated invoice totals
export interface CalculatedInvoice {
  items: CalculatedInvoiceItem[];
  gross_total: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
  coupon_code?: string;
  coupon_discount_amount: number;
  tax_amount: number;
  net_total: number;
}

