import { billingRepository } from './billing.repository';
import type {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceFilters,
  CreateReceiptDto,
  UpdateReceiptDto,
  ReceiptFilters,
  CalculatedInvoiceItem,
  CalculatedInvoice,
  CreateInvoiceItemDto,
  BillingVisitsFilters,
  CreateAdvanceDto,
  AdvanceFilters,
  CreatePaymentDto,
} from './billing.types';

// Tax rate configuration (can be moved to env or config)
const TAX_RATE = 0.18; // 18% GST

export const billingService = {
  /**
   * Calculate item amounts (discount and net)
   */
  calculateItemAmounts(item: CreateInvoiceItemDto): CalculatedInvoiceItem {
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
    } else {
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
  parseCouponCode(couponCode?: string): number {
    if (!couponCode) return 0;
    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed.startsWith('CC')) return 0;
    const amountStr = trimmed.substring(2);
    const amount = parseFloat(amountStr);
    return isNaN(amount) || amount <= 0 ? 0 : amount;
  },

  /**
   * Calculate invoice totals
   */
  calculateInvoiceTotals(
    items: CreateInvoiceItemDto[],
    discountType: 'percentage' | 'fixed' = 'percentage',
    discountValue: number = 0,
    couponCode?: string
  ): CalculatedInvoice {
    // Calculate each item
    const calculatedItems = items.map((item) => this.calculateItemAmounts(item));

    // Gross total = sum of all item net amounts
    const grossTotal = calculatedItems.reduce((sum, item) => sum + item.net_amount, 0);

    // Invoice-level discount
    let invoiceDiscountAmount = 0;
    if (discountType === 'percentage') {
      invoiceDiscountAmount = grossTotal * (discountValue / 100);
    } else {
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
   * Create invoice with items (visit_id is now optional)
   */
  async createInvoice(dto: CreateInvoiceDto, createdBy?: string) {
    // Generate invoice number
    const invoiceNumber = await billingRepository.generateInvoiceNumber();

    // Calculate totals (including coupon discount)
    const calculated = this.calculateInvoiceTotals(
      dto.items,
      dto.discount_type ?? 'percentage',
      dto.discount_value ?? 0,
      dto.coupon_code
    );

    // Build the data object — visit connection is optional
    const data: any = {
      invoice_number: invoiceNumber,
      patient: { connect: { patient_id: dto.patient_id } },
      gross_total: calculated.gross_total,
      discount_type: calculated.discount_type,
      discount_value: calculated.discount_value,
      discount_amount: calculated.discount_amount,
      coupon_code: dto.coupon_code,
      coupon_discount_amount: calculated.coupon_discount_amount,
      tax_amount: calculated.tax_amount,
      net_total: calculated.net_total,
      balance_amount: calculated.net_total, // Initially, balance = net_total
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
    };

    // Only connect visit if visit_id is provided
    if (dto.visit_id) {
      data.visit = { connect: { visit_id: dto.visit_id } };
    }

    // Create invoice
    const invoice = await billingRepository.createInvoice(data);

    return invoice;
  },

  /**
   * Get invoice by ID
   */
  async getInvoice(id: number) {
    const invoice = await billingRepository.findInvoiceById(id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return invoice;
  },

  /**
   * List invoices with filters
   */
  async listInvoices(filters: InvoiceFilters) {
    return billingRepository.findInvoices(filters);
  },

  /**
   * Update invoice
   */
  async updateInvoice(id: number, dto: UpdateInvoiceDto, updatedBy?: string) {
    // Check if invoice exists
    const existing = await billingRepository.findInvoiceById(id);
    if (!existing) {
      throw new Error('Invoice not found');
    }

    // Check if invoice is fully paid — if so, cannot update
    if (existing.status === 'paid') {
      throw new Error('Cannot update invoice — it is already fully paid');
    }

    // If items are being updated, recalculate totals
    if (dto.items && dto.items.length > 0) {
      // Delete existing items
      await billingRepository.deleteInvoiceItems(id);

      // Calculate new totals (including coupon discount)
      const calculated = this.calculateInvoiceTotals(
        dto.items as CreateInvoiceItemDto[],
        dto.discount_type ?? existing.discount_type as 'percentage' | 'fixed',
        dto.discount_value ?? Number(existing.discount_value),
        dto.coupon_code ?? existing.coupon_code ?? undefined
      );

      const paidAmount = Number(existing.paid_amount ?? 0);
      const balanceAmount = Math.max(0, calculated.net_total - paidAmount);
 
      // Update invoice with new items
      return billingRepository.updateInvoice(id, {
        gross_total: calculated.gross_total,
        discount_type: calculated.discount_type,
        discount_value: calculated.discount_value,
        discount_amount: calculated.discount_amount,
        coupon_code: dto.coupon_code,
        coupon_discount_amount: calculated.coupon_discount_amount,
        tax_amount: calculated.tax_amount,
        net_total: calculated.net_total,
        balance_amount: balanceAmount,
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
    return billingRepository.updateInvoice(id, {
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
  async deleteInvoice(id: number, deletedBy?: string) {
    const existing = await billingRepository.findInvoiceById(id);
    if (!existing) {
      throw new Error('Invoice not found');
    }
    return billingRepository.deleteInvoice(id, deletedBy);
  },

  /**
   * Get visit prescriptions formatted for invoice
   */
  async getVisitPrescriptionsForInvoice(visitId: number) {
    const prescriptions = await billingRepository.getVisitPrescriptions(visitId);

    return prescriptions.map((p) => ({
      item_type: 'drug' as const,
      item_name: p.drug_name,
      reference_id: p.drug_id,
      quantity: p.quantity ?? 1,
      unit_amount: p.drug?.amount ? Number(p.drug.amount) : 0,
      premium: 0,
      discount_type: 'percentage' as const,
      discount_value: 0,
      tax_applicable: false,
      notes: p.notes,
    }));
  },

  // ============================================
  // Receipt operations
  // ============================================

  /**
   * Create receipt (no longer auto-marks invoice as paid)
   */
  async createReceipt(dto: CreateReceiptDto, createdBy?: string) {
    const receiptNumber = await billingRepository.generateReceiptNumber();

    const data: any = {
      receipt_number: receiptNumber,
      patient: { connect: { patient_id: dto.patient_id } },
      amount: dto.amount,
      payment_method: dto.payment_method,
      receipt_type: dto.receipt_type ?? 'payment',
      payment_date: dto.payment_date ?? new Date(),
      notes: dto.notes,
      createdBy,
    };

    // Only connect invoice if invoice_id is provided
    if (dto.invoice_id) {
      data.invoice = { connect: { invoice_id: dto.invoice_id } };
    }

    const receipt = await billingRepository.createReceipt(data);

    // If this receipt is for an invoice, recalculate the invoice's paid amounts
    if (dto.invoice_id) {
      await billingRepository.updateInvoicePaidAmount(dto.invoice_id);
    }

    return receipt;
  },

  /**
   * Get receipt by ID
   */
  async getReceipt(id: number) {
    const receipt = await billingRepository.findReceiptById(id);
    if (!receipt) {
      throw new Error('Receipt not found');
    }
    return receipt;
  },

  /**
   * List receipts with filters
   */
  async listReceipts(filters: ReceiptFilters) {
    return billingRepository.findReceipts(filters);
  },

  /**
   * Update receipt
   */
  async updateReceipt(id: number, dto: UpdateReceiptDto, updatedBy?: string) {
    const existing = await billingRepository.findReceiptById(id);
    if (!existing) {
      throw new Error('Receipt not found');
    }

    return billingRepository.updateReceipt(id, {
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
  async deleteReceipt(id: number, deletedBy?: string) {
    const existing = await billingRepository.findReceiptById(id);
    if (!existing) {
      throw new Error('Receipt not found');
    }
    return billingRepository.deleteReceipt(id, deletedBy);
  },

  /**
   * List billing visits with invoice + receipt data
   */
  async listBillingVisits(filters: BillingVisitsFilters) {
    return billingRepository.findBillingVisits(filters);
  },

  // ============================================
  // Advance / Wallet operations
  // ============================================

  /**
   * Deposit advance amount for a patient
   */
  async depositAdvance(dto: CreateAdvanceDto, createdBy?: string) {
    // Create advance record (positive amount = deposit)
    const advance = await billingRepository.createAdvance({
      patient: { connect: { patient_id: dto.patient_id } },
      amount: dto.amount,
      transaction_type: 'deposit',
      payment_method: dto.payment_method,
      notes: dto.notes,
      createdBy,
    });

    // Also create a receipt for the advance deposit
    const receiptNumber = await billingRepository.generateReceiptNumber();
    await billingRepository.createReceipt({
      receipt_number: receiptNumber,
      patient: { connect: { patient_id: dto.patient_id } },
      amount: dto.amount,
      payment_method: dto.payment_method,
      receipt_type: 'advance_deposit',
      notes: dto.notes || `Advance deposit`,
      createdBy,
    });

    // Return the advance with updated balance
    const balance = await billingRepository.getAdvanceBalance(dto.patient_id);

    return {
      advance,
      balance,
    };
  },

  /**
   * Get advance balance for a patient
   */
  async getAdvanceBalance(patientId: number) {
    const balance = await billingRepository.getAdvanceBalance(patientId);
    return { patient_id: patientId, balance };
  },

  /**
   * Get advance ledger (paginated transactions)
   */
  async getAdvanceLedger(patientId: number, filters: AdvanceFilters) {
    return billingRepository.findAdvances(patientId, filters);
  },

  // ============================================
  // Payment operations (from invoice page)
  // ============================================

  /**
   * Create payment against an invoice (supports partial payment + advance deduction)
   */
  async createPayment(dto: CreatePaymentDto, createdBy?: string) {
    const invoice = await billingRepository.findInvoiceById(dto.invoice_id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.status === 'paid') {
      throw new Error('Invoice is already fully paid');
    }

    const totalPayment = dto.amount + (dto.from_advance ?? 0);
    const invoiceBalance = Number(invoice.balance_amount);

    if (totalPayment > invoiceBalance) {
      throw new Error(`Payment amount (₹${totalPayment}) exceeds invoice balance (₹${invoiceBalance})`);
    }

    const results: any = {
      receipts: [],
      advance_deduction: null,
    };

    // 1. If paying from advance, create advance deduction
    if (dto.from_advance && dto.from_advance > 0) {
      // Check advance balance
      const advanceBalance = await billingRepository.getAdvanceBalance(dto.patient_id);
      if (dto.from_advance > advanceBalance) {
        throw new Error(`Insufficient advance balance. Available: ₹${advanceBalance}`);
      }

      // Create advance deduction record (negative amount)
      const deduction = await billingRepository.createAdvance({
        patient: { connect: { patient_id: dto.patient_id } },
        amount: -dto.from_advance, // Negative = deduction
        transaction_type: 'deduction',
        reference_type: 'invoice',
        reference_id: dto.invoice_id,
        notes: dto.notes || `Deducted against invoice`,
        createdBy,
      });

      results.advance_deduction = deduction;

      // Create a receipt for the advance deduction against the invoice
      const receiptNumber = await billingRepository.generateReceiptNumber();
      const advanceReceipt = await billingRepository.createReceipt({
        receipt_number: receiptNumber,
        invoice: { connect: { invoice_id: dto.invoice_id } },
        patient: { connect: { patient_id: dto.patient_id } },
        amount: dto.from_advance,
        payment_method: 'other',
        receipt_type: 'advance_deduction',
        payment_date: dto.payment_date ?? new Date(),
        notes: `Paid from advance`,
        createdBy,
      });

      results.receipts.push(advanceReceipt);
    }

    // 2. If paying cash/card/upi, create a regular receipt
    if (dto.amount > 0) {
      const receiptNumber = await billingRepository.generateReceiptNumber();
      const paymentReceipt = await billingRepository.createReceipt({
        receipt_number: receiptNumber,
        invoice: { connect: { invoice_id: dto.invoice_id } },
        patient: { connect: { patient_id: dto.patient_id } },
        amount: dto.amount,
        payment_method: dto.payment_method,
        receipt_type: 'payment',
        payment_date: dto.payment_date ?? new Date(),
        notes: dto.notes,
        createdBy,
      });

      results.receipts.push(paymentReceipt);
    }

    // 3. Recalculate invoice paid amounts and status
    const updatedInvoice = await billingRepository.updateInvoicePaidAmount(dto.invoice_id);
    results.invoice = updatedInvoice;

    // 4. Get updated advance balance
    results.advance_balance = await billingRepository.getAdvanceBalance(dto.patient_id);

    return results;
  },

  /**
   * Get pending invoices for a patient
   */
  async getPatientPendingInvoices(patientId: number) {
    return billingRepository.findPendingInvoicesByPatient(patientId);
  },

  /**
   * Get all payments for an invoice
   */
  async getInvoicePayments(invoiceId: number) {
    return billingRepository.findPaymentsByInvoice(invoiceId);
  },
};
