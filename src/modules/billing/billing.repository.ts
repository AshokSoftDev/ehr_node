import { prisma } from '../../utils/prisma';
import type { Prisma } from '@prisma/client';
import type { InvoiceFilters, ReceiptFilters, BillingVisitsFilters, AdvanceFilters } from './billing.types';

export const billingRepository = {
  // Invoice operations
  async createInvoice(data: Prisma.InvoiceCreateInput) {
    return prisma.invoice.create({
      data,
      include: {
        items: true,
        patient: {
          select: {
            patient_id: true,
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
        visit: {
          select: {
            visit_id: true,
            visit_type: true,
            visit_date: true,
          },
        },
      },
    });
  },

  async findInvoiceById(id: number) {
    return prisma.invoice.findUnique({
      where: { invoice_id: id },
      include: {
        items: true,
        patient: {
          select: {
            patient_id: true,
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
        visit: {
          select: {
            visit_id: true,
            visit_type: true,
            visit_date: true,
          },
        },
        receipts: {
          where: { deletedAt: null, status: 1 },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },

  async findInvoices(filters: InvoiceFilters) {
    const { patient_id, visit_id, status, from_date, to_date, search, page = 1, limit = 20 } = filters;
    
    const where: Prisma.InvoiceWhereInput = {
      deletedAt: null,
      ...(patient_id && { patient_id }),
      ...(visit_id && { visit_id }),
      ...(status && { status }),
      ...(from_date && { invoice_date: { gte: new Date(from_date) } }),
      ...(to_date && { invoice_date: { lte: new Date(to_date) } }),
      ...(search && {
        OR: [
          { invoice_number: { contains: search, mode: 'insensitive' as const } },
          { patient: { firstName: { contains: search, mode: 'insensitive' as const } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' as const } } },
          { patient: { mrn: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          items: true,
          patient: {
            select: {
              patient_id: true,
              firstName: true,
              lastName: true,
              mrn: true,
            },
          },
          visit: {
            select: {
              visit_id: true,
              visit_type: true,
              visit_date: true,
            },
          },
          receipts: {
            where: { deletedAt: null, status: 1 },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      invoices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Find pending invoices for a patient (draft or partial status)
  async findPendingInvoicesByPatient(patientId: number) {
    return prisma.invoice.findMany({
      where: {
        patient_id: patientId,
        deletedAt: null,
        status: { in: ['draft', 'partial'] },
      },
      include: {
        items: true,
        patient: {
          select: {
            patient_id: true,
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
        visit: {
          select: {
            visit_id: true,
            visit_type: true,
            visit_date: true,
          },
        },
        receipts: {
          where: { deletedAt: null, status: 1 },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateInvoice(id: number, data: Prisma.InvoiceUpdateInput) {
    return prisma.invoice.update({
      where: { invoice_id: id },
      data,
      include: {
        items: true,
        patient: {
          select: {
            patient_id: true,
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
        visit: {
          select: {
            visit_id: true,
            visit_type: true,
            visit_date: true,
          },
        },
      },
    });
  },

  async deleteInvoice(id: number, deletedBy?: string) {
    return prisma.invoice.update({
      where: { invoice_id: id },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
  },

  // Invoice Items operations
  async deleteInvoiceItems(invoiceId: number) {
    return prisma.invoiceItem.deleteMany({
      where: { invoice_id: invoiceId },
    });
  },

  async createInvoiceItems(items: Prisma.InvoiceItemCreateManyInput[]) {
    return prisma.invoiceItem.createMany({
      data: items,
    });
  },

  // Receipt operations
  async createReceipt(data: Prisma.ReceiptCreateInput) {
    return prisma.receipt.create({
      data,
      include: {
        invoice: {
          select: {
            invoice_id: true,
            invoice_number: true,
            net_total: true,
          },
        },
        patient: {
          select: {
            patient_id: true,
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
      },
    });
  },

  async findReceiptById(id: number) {
    return prisma.receipt.findUnique({
      where: { receipt_id: id },
      include: {
        invoice: {
          select: {
            invoice_id: true,
            invoice_number: true,
            net_total: true,
          },
        },
        patient: {
          select: {
            patient_id: true,
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
      },
    });
  },

  async findReceipts(filters: ReceiptFilters) {
    const { invoice_id, patient_id, payment_method, receipt_type, from_date, to_date, search, page = 1, limit = 20 } = filters;
    
    const where: Prisma.ReceiptWhereInput = {
      deletedAt: null,
      status: 1,
      ...(invoice_id && { invoice_id }),
      ...(patient_id && { patient_id }),
      ...(payment_method && { payment_method }),
      ...(receipt_type && { receipt_type }),
      ...(from_date && { payment_date: { gte: new Date(from_date) } }),
      ...(to_date && { payment_date: { lte: new Date(to_date) } }),
      ...(search && {
        OR: [
          { receipt_number: { contains: search, mode: 'insensitive' as const } },
          { invoice: { invoice_number: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };

    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        include: {
          invoice: {
            select: {
              invoice_id: true,
              invoice_number: true,
              net_total: true,
            },
          },
          patient: {
            select: {
              patient_id: true,
              firstName: true,
              lastName: true,
              mrn: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.receipt.count({ where }),
    ]);

    return {
      receipts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Get all payments for an invoice
  async findPaymentsByInvoice(invoiceId: number) {
    return prisma.receipt.findMany({
      where: {
        invoice_id: invoiceId,
        deletedAt: null,
        status: 1,
      },
      include: {
        patient: {
          select: {
            patient_id: true,
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateReceipt(id: number, data: Prisma.ReceiptUpdateInput) {
    return prisma.receipt.update({
      where: { receipt_id: id },
      data,
      include: {
        invoice: {
          select: {
            invoice_id: true,
            invoice_number: true,
            net_total: true,
          },
        },
        patient: {
          select: {
            patient_id: true,
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
      },
    });
  },

  async deleteReceipt(id: number, deletedBy?: string) {
    return prisma.receipt.update({
      where: { receipt_id: id },
      data: {
        status: 0,
        deletedAt: new Date(),
        deletedBy,
      },
    });
  },

  // Get visit prescriptions for invoice
  async getVisitPrescriptions(visitId: number) {
    return prisma.prescription.findMany({
      where: {
        visit_id: visitId,
        status: 1,
        deletedAt: null,
      },
      include: {
        drug: true,
      },
    });
  },

  // Generate invoice number
  async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const prefix = `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoice_number: { startsWith: prefix },
      },
      orderBy: { invoice_number: 'desc' },
    });

    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoice_number.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `${prefix}-${String(sequence).padStart(4, '0')}`;
  },

  // Generate receipt number
  async generateReceiptNumber(): Promise<string> {
    const today = new Date();
    const prefix = `RCP-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const lastReceipt = await prisma.receipt.findFirst({
      where: {
        receipt_number: { startsWith: prefix },
      },
      orderBy: { receipt_number: 'desc' },
    });

    let sequence = 1;
    if (lastReceipt) {
      const lastSequence = parseInt(lastReceipt.receipt_number.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `${prefix}-${String(sequence).padStart(4, '0')}`;
  },

  // Consolidated billing visits with invoice + receipt + patient
  async findBillingVisits(filters: BillingVisitsFilters) {
    const { search, status = '1', page = 1, limit = 15 } = filters;

    const where: Prisma.VisitWhereInput = {
      deletedAt: null,
      ...(status && { status: Number(status) }),
      ...(search && {
        OR: [
          { patient: { firstName: { contains: search, mode: 'insensitive' as const } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' as const } } },
          { patient: { mrn: { contains: search, mode: 'insensitive' as const } } },
          { patient: { mobileNumber: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };

    const [visits, total] = await Promise.all([
      prisma.visit.findMany({
        where,
        include: {
          patient: {
            select: {
              patient_id: true,
              firstName: true,
              lastName: true,
              mrn: true,
              mobileNumber: true,
            },
          },
          doctor: {
            select: {
              id: true,
              displayName: true,
            },
          },
          appointment: {
            select: {
              appointment_id: true,
              appointment_type: true,
            },
          },
          invoices: {
            where: { deletedAt: null },
            include: {
              items: true,
              receipts: {
                where: { deletedAt: null, status: 1 },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { visit_date: 'desc' },
      }),
      prisma.visit.count({ where }),
    ]);

    return {
      visits,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // ============================================
  // Patient Advance / Wallet operations
  // ============================================

  async createAdvance(data: Prisma.PatientAdvanceCreateInput) {
    return prisma.patientAdvance.create({
      data,
      include: {
        patient: {
          select: {
            patient_id: true,
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
      },
    });
  },

  // Get advance balance for a patient (sum of all active advance amounts)
  async getAdvanceBalance(patientId: number): Promise<number> {
    const result = await prisma.patientAdvance.aggregate({
      where: {
        patient_id: patientId,
        status: 1,
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
    });
    return Number(result._sum.amount ?? 0);
  },

  // Get advance ledger (paginated transactions)
  async findAdvances(patientId: number, filters: AdvanceFilters) {
    const { transaction_type, page = 1, limit = 20 } = filters;

    const where: Prisma.PatientAdvanceWhereInput = {
      patient_id: patientId,
      status: 1,
      deletedAt: null,
      ...(transaction_type && { transaction_type }),
    };

    const [advances, total] = await Promise.all([
      prisma.patientAdvance.findMany({
        where,
        include: {
          patient: {
            select: {
              patient_id: true,
              firstName: true,
              lastName: true,
              mrn: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patientAdvance.count({ where }),
    ]);

    return {
      advances,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Recalculate and update invoice paid_amount and balance_amount
  async updateInvoicePaidAmount(invoiceId: number) {
    // Sum all active payments for this invoice
    const result = await prisma.receipt.aggregate({
      where: {
        invoice_id: invoiceId,
        status: 1,
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
    });

    const paidAmount = Number(result._sum.amount ?? 0);

    // Get the invoice net_total
    const invoice = await prisma.invoice.findUnique({
      where: { invoice_id: invoiceId },
      select: { net_total: true },
    });

    const netTotal = Number(invoice?.net_total ?? 0);
    const balanceAmount = Math.max(0, netTotal - paidAmount);

    // Determine status
    let status = 'draft';
    if (paidAmount >= netTotal && netTotal > 0) {
      status = 'paid';
    } else if (paidAmount > 0) {
      status = 'partial';
    }

    return prisma.invoice.update({
      where: { invoice_id: invoiceId },
      data: {
        paid_amount: paidAmount,
        balance_amount: balanceAmount,
        status,
      },
    });
  },
};
