import { z } from 'zod';

// Invoice Item Schema
export const invoiceItemSchema = z.object({
  item_type: z.enum(['drug', 'procedure', 'package', 'custom']),
  item_name: z.string().min(1, 'Item name is required'),
  reference_id: z.number().int().positive().optional().nullable(),
  quantity: z.number().int().positive().default(1),
  unit_amount: z.number().nonnegative().default(0),
  premium: z.number().nonnegative().default(0),
  discount_type: z.enum(['percentage', 'fixed']).default('percentage'),
  discount_value: z.number().nonnegative().default(0),
  tax_applicable: z.boolean().default(false),
  notes: z.string().nullish(),
  assigned_user: z.string().nullish(),
});


export const updateInvoiceItemSchema = invoiceItemSchema.partial().extend({
  item_id: z.number().int().positive().optional(),
});

// Create Invoice Schema
export const createInvoiceSchema = z.object({
  patient_id: z.number().int().positive('Patient ID is required'),
  visit_id: z.number().int().positive('Visit ID is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  discount_type: z.enum(['percentage', 'fixed']).default('percentage'),
  discount_value: z.number().nonnegative().default(0),
  coupon_code: z.string().optional(),
  discount_reason: z.string().optional(),
  invoice_date: z.coerce.date().optional(),
  due_date: z.coerce.date().optional(),
  notes: z.string().optional(),
});

// Update Invoice Schema
export const updateInvoiceSchema = z.object({
  items: z.array(updateInvoiceItemSchema).optional(),
  discount_type: z.enum(['percentage', 'fixed']).optional(),
  discount_value: z.number().nonnegative().optional(),
  coupon_code: z.string().optional(),
  discount_reason: z.string().optional(),
  invoice_date: z.coerce.date().optional(),
  due_date: z.coerce.date().optional(),
  notes: z.string().optional(),
  status: z.enum(['draft', 'sent', 'paid', 'cancelled']).optional(),
});

// Invoice Filters Schema
export const invoiceFiltersSchema = z.object({
  patient_id: z.coerce.number().int().positive().optional(),
  visit_id: z.coerce.number().int().positive().optional(),
  status: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Create Receipt Schema
export const createReceiptSchema = z.object({
  invoice_id: z.number().int().positive('Invoice ID is required'),
  patient_id: z.number().int().positive('Patient ID is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  payment_method: z.enum(['cash', 'card', 'upi', 'bank_transfer', 'other']),
  payment_date: z.coerce.date().optional(),
  notes: z.string().optional(),
});

// Update Receipt Schema
export const updateReceiptSchema = z.object({
  amount: z.number().positive().optional(),
  payment_method: z.enum(['cash', 'card', 'upi', 'bank_transfer', 'other']).optional(),
  payment_date: z.coerce.date().optional(),
  notes: z.string().optional(),
});

// Receipt Filters Schema
export const receiptFiltersSchema = z.object({
  invoice_id: z.coerce.number().int().positive().optional(),
  patient_id: z.coerce.number().int().positive().optional(),
  payment_method: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ID Param Schema
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const visitIdParamSchema = z.object({
  visitId: z.coerce.number().int().positive(),
});
