"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingService = void 0;
const billing_repository_1 = require("./billing.repository");
// Tax rate configuration (can be moved to env or config)
const TAX_RATE = 0.18; // 18% GST
exports.billingService = {
    /**
     * Calculate item amounts (discount and net)
     */
    calculateItemAmounts(item) {
        const quantity = item.quantity ?? 1;
        const unitAmount = item.unit_amount ?? 0;
        const premium = item.premium ?? 0;
        const discountType = item.discount_type ?? 'percentage';
        const discountValue = item.discount_value ?? 0;
        // Base amount = (unit_amount * quantity) + premium
        const baseAmount = unitAmount * quantity + premium;
        // Calculate discount
        let discountAmount = 0;
        if (discountType === 'percentage') {
            discountAmount = baseAmount * (discountValue / 100);
        }
        else {
            discountAmount = discountValue;
        }
        // Net amount = base - discount
        const netAmount = Math.max(0, baseAmount - discountAmount);
        return {
            item_type: item.item_type,
            item_name: item.item_name,
            reference_id: item.reference_id,
            quantity,
            unit_amount: unitAmount,
            premium,
            discount_type: discountType,
            discount_value: discountValue,
            discount_amount: Math.round(discountAmount * 100) / 100,
            tax_applicable: item.tax_applicable ?? false,
            net_amount: Math.round(netAmount * 100) / 100,
            notes: item.notes,
            assigned_user: item.assigned_user,
        };
    },
    /**
     * Validate and parse coupon code (format: CC followed by amount, e.g., CC100 = ₹100)
     */
    parseCouponCode(couponCode) {
        if (!couponCode)
            return 0;
        const trimmed = couponCode.trim().toUpperCase();
        if (!trimmed.startsWith('CC'))
            return 0;
        const amountStr = trimmed.substring(2);
        const amount = parseFloat(amountStr);
        return isNaN(amount) || amount <= 0 ? 0 : amount;
    },
    /**
     * Calculate invoice totals
     */
    calculateInvoiceTotals(items, discountType = 'percentage', discountValue = 0, couponCode) {
        // Calculate each item
        const calculatedItems = items.map((item) => this.calculateItemAmounts(item));
        // Gross total = sum of all item net amounts
        const grossTotal = calculatedItems.reduce((sum, item) => sum + item.net_amount, 0);
        // Invoice-level discount
        let invoiceDiscountAmount = 0;
        if (discountType === 'percentage') {
            invoiceDiscountAmount = grossTotal * (discountValue / 100);
        }
        else {
            invoiceDiscountAmount = discountValue;
        }
        // Coupon discount (extracted from coupon code like CC100, CC1500)
        const couponDiscountAmount = this.parseCouponCode(couponCode);
        // Tax amount (only for tax-applicable items)
        const taxableAmount = calculatedItems
            .filter((item) => item.tax_applicable)
            .reduce((sum, item) => sum + item.net_amount, 0);
        const taxAmount = taxableAmount * TAX_RATE;
        // Net total = gross - discount - coupon + tax
        const netTotal = Math.max(0, grossTotal - invoiceDiscountAmount - couponDiscountAmount + taxAmount);
        return {
            items: calculatedItems,
            gross_total: Math.round(grossTotal * 100) / 100,
            discount_type: discountType,
            discount_value: discountValue,
            discount_amount: Math.round(invoiceDiscountAmount * 100) / 100,
            coupon_code: couponCode,
            coupon_discount_amount: Math.round(couponDiscountAmount * 100) / 100,
            tax_amount: Math.round(taxAmount * 100) / 100,
            net_total: Math.round(netTotal * 100) / 100,
        };
    },
    /**
     * Create invoice with items
     */
    async createInvoice(dto, createdBy) {
        // Generate invoice number
        const invoiceNumber = await billing_repository_1.billingRepository.generateInvoiceNumber();
        // Calculate totals (including coupon discount)
        const calculated = this.calculateInvoiceTotals(dto.items, dto.discount_type ?? 'percentage', dto.discount_value ?? 0, dto.coupon_code);
        // Create invoice
        const invoice = await billing_repository_1.billingRepository.createInvoice({
            invoice_number: invoiceNumber,
            patient: { connect: { patient_id: dto.patient_id } },
            visit: { connect: { visit_id: dto.visit_id } },
            gross_total: calculated.gross_total,
            discount_type: calculated.discount_type,
            discount_value: calculated.discount_value,
            discount_amount: calculated.discount_amount,
            coupon_code: dto.coupon_code,
            coupon_discount_amount: calculated.coupon_discount_amount,
            tax_amount: calculated.tax_amount,
            net_total: calculated.net_total,
            discount_reason: dto.discount_reason,
            invoice_date: dto.invoice_date ?? new Date(),
            due_date: dto.due_date,
            notes: dto.notes,
            createdBy,
            items: {
                create: calculated.items.map((item) => ({
                    item_type: item.item_type,
                    item_name: item.item_name,
                    reference_id: item.reference_id,
                    quantity: item.quantity,
                    unit_amount: item.unit_amount,
                    premium: item.premium,
                    discount_type: item.discount_type,
                    discount_value: item.discount_value,
                    discount_amount: item.discount_amount,
                    tax_applicable: item.tax_applicable,
                    net_amount: item.net_amount,
                    notes: item.notes,
                    assigned_user: item.assigned_user,
                })),
            },
        });
        return invoice;
    },
    /**
     * Get invoice by ID
     */
    async getInvoice(id) {
        const invoice = await billing_repository_1.billingRepository.findInvoiceById(id);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        return invoice;
    },
    /**
     * List invoices with filters
     */
    async listInvoices(filters) {
        return billing_repository_1.billingRepository.findInvoices(filters);
    },
    /**
     * Update invoice
     */
    async updateInvoice(id, dto, updatedBy) {
        // Check if invoice exists
        const existing = await billing_repository_1.billingRepository.findInvoiceById(id);
        if (!existing) {
            throw new Error('Invoice not found');
        }
        // Check if invoice has receipts - if so, cannot update
        const receipts = await billing_repository_1.billingRepository.findReceipts({ invoice_id: id });
        if (receipts.receipts.length > 0) {
            throw new Error('Cannot update invoice - receipt has already been generated');
        }
        // If items are being updated, recalculate totals
        if (dto.items && dto.items.length > 0) {
            // Delete existing items
            await billing_repository_1.billingRepository.deleteInvoiceItems(id);
            // Calculate new totals (including coupon discount)
            const calculated = this.calculateInvoiceTotals(dto.items, dto.discount_type ?? existing.discount_type, dto.discount_value ?? Number(existing.discount_value), dto.coupon_code ?? existing.coupon_code ?? undefined);
            // Update invoice with new items
            return billing_repository_1.billingRepository.updateInvoice(id, {
                gross_total: calculated.gross_total,
                discount_type: calculated.discount_type,
                discount_value: calculated.discount_value,
                discount_amount: calculated.discount_amount,
                coupon_code: dto.coupon_code,
                coupon_discount_amount: calculated.coupon_discount_amount,
                tax_amount: calculated.tax_amount,
                net_total: calculated.net_total,
                discount_reason: dto.discount_reason,
                invoice_date: dto.invoice_date,
                due_date: dto.due_date,
                notes: dto.notes,
                status: dto.status,
                updatedBy,
                items: {
                    create: calculated.items.map((item) => ({
                        item_type: item.item_type,
                        item_name: item.item_name,
                        reference_id: item.reference_id,
                        quantity: item.quantity,
                        unit_amount: item.unit_amount,
                        premium: item.premium,
                        discount_type: item.discount_type,
                        discount_value: item.discount_value,
                        discount_amount: item.discount_amount,
                        tax_applicable: item.tax_applicable,
                        net_amount: item.net_amount,
                        notes: item.notes,
                        assigned_user: item.assigned_user,
                    })),
                },
            });
        }
        // Update only non-item fields
        return billing_repository_1.billingRepository.updateInvoice(id, {
            coupon_code: dto.coupon_code,
            discount_reason: dto.discount_reason,
            invoice_date: dto.invoice_date,
            due_date: dto.due_date,
            notes: dto.notes,
            status: dto.status,
            updatedBy,
        });
    },
    /**
     * Delete invoice (soft delete)
     */
    async deleteInvoice(id, deletedBy) {
        const existing = await billing_repository_1.billingRepository.findInvoiceById(id);
        if (!existing) {
            throw new Error('Invoice not found');
        }
        return billing_repository_1.billingRepository.deleteInvoice(id, deletedBy);
    },
    /**
     * Get visit prescriptions formatted for invoice
     */
    async getVisitPrescriptionsForInvoice(visitId) {
        const prescriptions = await billing_repository_1.billingRepository.getVisitPrescriptions(visitId);
        return prescriptions.map((p) => ({
            item_type: 'drug',
            item_name: p.drug_name,
            reference_id: p.drug_id,
            quantity: p.quantity ?? 1,
            unit_amount: p.drug?.amount ? Number(p.drug.amount) : 0,
            premium: 0,
            discount_type: 'percentage',
            discount_value: 0,
            tax_applicable: false,
            notes: p.notes,
        }));
    },
    // Receipt operations
    /**
     * Create receipt
     */
    async createReceipt(dto, createdBy) {
        const receiptNumber = await billing_repository_1.billingRepository.generateReceiptNumber();
        return billing_repository_1.billingRepository.createReceipt({
            receipt_number: receiptNumber,
            invoice: { connect: { invoice_id: dto.invoice_id } },
            patient: { connect: { patient_id: dto.patient_id } },
            amount: dto.amount,
            payment_method: dto.payment_method,
            payment_date: dto.payment_date ?? new Date(),
            notes: dto.notes,
            createdBy,
        });
    },
    /**
     * Get receipt by ID
     */
    async getReceipt(id) {
        const receipt = await billing_repository_1.billingRepository.findReceiptById(id);
        if (!receipt) {
            throw new Error('Receipt not found');
        }
        return receipt;
    },
    /**
     * List receipts with filters
     */
    async listReceipts(filters) {
        return billing_repository_1.billingRepository.findReceipts(filters);
    },
    /**
     * Update receipt
     */
    async updateReceipt(id, dto, updatedBy) {
        const existing = await billing_repository_1.billingRepository.findReceiptById(id);
        if (!existing) {
            throw new Error('Receipt not found');
        }
        return billing_repository_1.billingRepository.updateReceipt(id, {
            amount: dto.amount,
            payment_method: dto.payment_method,
            payment_date: dto.payment_date,
            notes: dto.notes,
            updatedBy,
        });
    },
    /**
     * Delete receipt (soft delete)
     */
    async deleteReceipt(id, deletedBy) {
        const existing = await billing_repository_1.billingRepository.findReceiptById(id);
        if (!existing) {
            throw new Error('Receipt not found');
        }
        return billing_repository_1.billingRepository.deleteReceipt(id, deletedBy);
    },
};
