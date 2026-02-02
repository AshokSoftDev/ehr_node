"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitIdParamSchema = exports.idParamSchema = exports.receiptFiltersSchema = exports.updateReceiptSchema = exports.createReceiptSchema = exports.invoiceFiltersSchema = exports.updateInvoiceSchema = exports.createInvoiceSchema = exports.updateInvoiceItemSchema = exports.invoiceItemSchema = void 0;
const zod_1 = require("zod");
// Invoice Item Schema
exports.invoiceItemSchema = zod_1.z.object({
    item_type: zod_1.z.enum(['drug', 'procedure', 'package', 'custom']),
    item_name: zod_1.z.string().min(1, 'Item name is required'),
    reference_id: zod_1.z.number().int().positive().optional().nullable(),
    quantity: zod_1.z.number().int().positive().default(1),
    unit_amount: zod_1.z.number().nonnegative().default(0),
    premium: zod_1.z.number().nonnegative().default(0),
    discount_type: zod_1.z.enum(['percentage', 'fixed']).default('percentage'),
    discount_value: zod_1.z.number().nonnegative().default(0),
    tax_applicable: zod_1.z.boolean().default(false),
    notes: zod_1.z.string().nullish(),
    assigned_user: zod_1.z.string().nullish(),
});
exports.updateInvoiceItemSchema = exports.invoiceItemSchema.partial().extend({
    item_id: zod_1.z.number().int().positive().optional(),
});
// Create Invoice Schema
exports.createInvoiceSchema = zod_1.z.object({
    patient_id: zod_1.z.number().int().positive('Patient ID is required'),
    visit_id: zod_1.z.number().int().positive('Visit ID is required'),
    items: zod_1.z.array(exports.invoiceItemSchema).min(1, 'At least one item is required'),
    discount_type: zod_1.z.enum(['percentage', 'fixed']).default('percentage'),
    discount_value: zod_1.z.number().nonnegative().default(0),
    coupon_code: zod_1.z.string().optional(),
    discount_reason: zod_1.z.string().optional(),
    invoice_date: zod_1.z.coerce.date().optional(),
    due_date: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().optional(),
});
// Update Invoice Schema
exports.updateInvoiceSchema = zod_1.z.object({
    items: zod_1.z.array(exports.updateInvoiceItemSchema).optional(),
    discount_type: zod_1.z.enum(['percentage', 'fixed']).optional(),
    discount_value: zod_1.z.number().nonnegative().optional(),
    coupon_code: zod_1.z.string().optional(),
    discount_reason: zod_1.z.string().optional(),
    invoice_date: zod_1.z.coerce.date().optional(),
    due_date: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().optional(),
    status: zod_1.z.enum(['draft', 'sent', 'paid', 'cancelled']).optional(),
});
// Invoice Filters Schema
exports.invoiceFiltersSchema = zod_1.z.object({
    patient_id: zod_1.z.coerce.number().int().positive().optional(),
    visit_id: zod_1.z.coerce.number().int().positive().optional(),
    status: zod_1.z.string().optional(),
    from_date: zod_1.z.string().optional(),
    to_date: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
});
// Create Receipt Schema
exports.createReceiptSchema = zod_1.z.object({
    invoice_id: zod_1.z.number().int().positive('Invoice ID is required'),
    patient_id: zod_1.z.number().int().positive('Patient ID is required'),
    amount: zod_1.z.number().positive('Amount must be greater than 0'),
    payment_method: zod_1.z.enum(['cash', 'card', 'upi', 'bank_transfer', 'other']),
    payment_date: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().optional(),
});
// Update Receipt Schema
exports.updateReceiptSchema = zod_1.z.object({
    amount: zod_1.z.number().positive().optional(),
    payment_method: zod_1.z.enum(['cash', 'card', 'upi', 'bank_transfer', 'other']).optional(),
    payment_date: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().optional(),
});
// Receipt Filters Schema
exports.receiptFiltersSchema = zod_1.z.object({
    invoice_id: zod_1.z.coerce.number().int().positive().optional(),
    patient_id: zod_1.z.coerce.number().int().positive().optional(),
    payment_method: zod_1.z.string().optional(),
    from_date: zod_1.z.string().optional(),
    to_date: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
});
// ID Param Schema
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
exports.visitIdParamSchema = zod_1.z.object({
    visitId: zod_1.z.coerce.number().int().positive(),
});
