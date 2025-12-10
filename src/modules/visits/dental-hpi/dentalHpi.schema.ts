import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);

// Teeth surfaces schema: { "18": ["center", "leftTop"], "17": ["center"] }
const teethSurfacesSchema = z.record(
  z.string(),
  z.array(z.enum(['center', 'leftTop', 'rightTop', 'leftBottom', 'rightBottom']))
);

// Chief complaints schema: array of complaint IDs
const chiefComplaintsSchema = z.array(z.string().min(1));

const dentalHpiBodySchema = z.object({
  dentition_type: z.enum(['primary', 'mixed', 'permanent']),
  teeth_surfaces: teethSurfacesSchema,
  chief_complaints: chiefComplaintsSchema.min(1, 'At least one chief complaint is required'),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
  duration_years: z.number().int().min(0).optional().default(0),
  duration_months: z.number().int().min(0).max(11).optional().default(0),
  duration_weeks: z.number().int().min(0).max(3).optional().default(0),
  duration_days: z.number().int().min(0).max(6).optional().default(0),
  notes: z.string().optional(),
});

const dentalHpiUpdateBodySchema = z.object({
  dentition_type: z.enum(['primary', 'mixed', 'permanent']).optional(),
  teeth_surfaces: teethSurfacesSchema.optional(),
  chief_complaints: chiefComplaintsSchema.optional(),
  severity: z.enum(['mild', 'moderate', 'severe']).optional().nullable(),
  duration_years: z.number().int().min(0).optional(),
  duration_months: z.number().int().min(0).max(11).optional(),
  duration_weeks: z.number().int().min(0).max(3).optional(),
  duration_days: z.number().int().min(0).max(6).optional(),
  notes: z.string().optional().nullable(),
});

export const createDentalHpiSchema = z.object({
  params: z.object({
    visitId: numericId,
  }),
  body: dentalHpiBodySchema,
});

export const updateDentalHpiSchema = z.object({
  params: z.object({
    visitId: numericId,
    hpiId: numericId,
  }),
  body: dentalHpiUpdateBodySchema,
});

export const listDentalHpiSchema = z.object({
  params: z.object({
    visitId: numericId,
  }),
});

export const dentalHpiParamsSchema = z.object({
  params: z.object({
    visitId: numericId,
    hpiId: numericId,
  }),
});
