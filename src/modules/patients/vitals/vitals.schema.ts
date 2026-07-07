import { z } from 'zod';

const toDate = (v: unknown) => {
  if (v == null || v === '') return undefined;
  if (v instanceof Date) return v;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? undefined : d;
};

export const listVitalsSchema = z.object({
  params: z.object({
    patientId: z.string().regex(/^\d+$/).transform(Number),
  }),
  query: z.object({
    visitId: z.string().regex(/^\d+$/).transform(Number).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const getVitalSchema = z.object({
  params: z.object({
    patientId: z.string().regex(/^\d+$/).transform(Number),
    vitalId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const createVitalSchema = z.object({
  params: z.object({
    patientId: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    visit_id: z.number().optional().nullable(),
    vital_date: z.preprocess(toDate, z.date()),
    vital_time: z.string().optional().nullable(),
    weight: z.number().optional().nullable(),
    weight_unit: z.string().optional(),
    height: z.number().optional().nullable(),
    height_unit: z.string().optional(),
    bmi: z.number().optional().nullable(),
    temperature: z.number().optional().nullable(),
    temperature_unit: z.string().optional(),
    pulse: z.number().int().optional().nullable(),
    rr: z.number().int().optional().nullable(),
    bp_systolic: z.number().int().optional().nullable(),
    bp_diastolic: z.number().int().optional().nullable(),
  }),
});

export const updateVitalSchema = z.object({
  params: z.object({
    patientId: z.string().regex(/^\d+$/).transform(Number),
    vitalId: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    visit_id: z.number().optional().nullable(),
    vital_date: z.preprocess(toDate, z.date()).optional(),
    vital_time: z.string().optional().nullable(),
    weight: z.number().optional().nullable(),
    weight_unit: z.string().optional(),
    height: z.number().optional().nullable(),
    height_unit: z.string().optional(),
    bmi: z.number().optional().nullable(),
    temperature: z.number().optional().nullable(),
    temperature_unit: z.string().optional(),
    pulse: z.number().int().optional().nullable(),
    rr: z.number().int().optional().nullable(),
    bp_systolic: z.number().int().optional().nullable(),
    bp_diastolic: z.number().int().optional().nullable(),
  }),
});
