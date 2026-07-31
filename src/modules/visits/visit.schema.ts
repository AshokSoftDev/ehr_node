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
    doctor_id: z.string().optional(),
    patient: z.string().optional(), // name or MRN
    patient_id: z.string().regex(/^\d+$/).transform(Number).optional(),
    reason: z.string().optional(),
    search: z.string().optional(),
    status: z.string().optional(), // appointment_status
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const createVisitSchema = z.object({
  body: z.object({
    patient_id: z.number(),
    doctor_id: z.string(),
    visit_date: z.preprocess(toDate, z.date()),
    visit_type: z.string(),
    reason_for_visit: z.string().optional(),
    location_id: z.number().optional(),
  }),
});

