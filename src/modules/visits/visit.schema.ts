import { z } from 'zod';

const toDate = (v: unknown) => {
  if (v == null || v === '') return undefined;
  if (v instanceof Date) return v;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? undefined : d;
};

export const listVisitsSchema = z.object({
  query: z.object({
    dateFrom: z.preprocess(toDate, z.date().optional()),
    dateTo: z.preprocess(toDate, z.date().optional()),
    doctor: z.string().optional(),
    patient: z.string().optional(), // name or MRN
    reason: z.string().optional(),
    status: z.string().optional(), // appointment_status
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

