import { prisma } from '../../utils/prisma';
import type { Prisma } from '@prisma/client';
import type { InvoiceFilters, ReceiptFilters } from './billing.types';

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
        receipts: true,
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
    const { invoice_id, patient_id, payment_method, from_date, to_date, search, page = 1, limit = 20 } = filters;
    
    const where: Prisma.ReceiptWhereInput = {
      deletedAt: null,
      status: 1,
      ...(invoice_id && { invoice_id }),
      ...(patient_id && { patient_id }),
      ...(payment_method && { payment_method }),
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
};
