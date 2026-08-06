import { z } from 'zod';

const toDate = (v: unknown) => {
  if (v == null || v === '') return undefined;
  if (v instanceof Date) return v;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? undefined : d;
};

export const getCatalogSchema = z.object({});

export const financialReportSchema = z.object({
  query: z.object({
    dateFrom: z.preprocess(toDate, z.date().optional()),
    dateTo: z.preprocess(toDate, z.date().optional()),
    doctor_id: z.string().optional(),
    status: z.string().optional(),
    payment_method: z.string().optional(),
    groupBy: z.enum(['day', 'week', 'month', 'doctor']).optional().default('day'),
  }),
});

export const clinicalReportSchema = z.object({
  query: z.object({
    dateFrom: z.preprocess(toDate, z.date().optional()),
    dateTo: z.preprocess(toDate, z.date().optional()),
    doctor_id: z.string().optional(),
    type: z.string().optional(),
  }),
});

export const operationalReportSchema = z.object({
  query: z.object({
    dateFrom: z.preprocess(toDate, z.date().optional()),
    dateTo: z.preprocess(toDate, z.date().optional()),
    doctor_id: z.string().optional(),
    location_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const demographicReportSchema = z.object({
  query: z.object({
    dateFrom: z.preprocess(toDate, z.date().optional()),
    dateTo: z.preprocess(toDate, z.date().optional()),
    gender: z.string().optional(),
    city: z.string().optional(),
  }),
});

export const customReportSchema = z.object({
  body: z.object({
    dataSource: z.enum(['invoices', 'appointments', 'visits', 'patients', 'receipts']),
    dateFrom: z.preprocess(toDate, z.date().optional()),
    dateTo: z.preprocess(toDate, z.date().optional()),
    filters: z.record(z.string(), z.any()).optional(),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(20),
  }),
});

export const aiInsightSchema = z.object({
  body: z.object({
    query: z.string().min(1, 'Please provide an analytical question or query'),
    context: z.record(z.string(), z.any()).optional(),
  }),
});
