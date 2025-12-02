import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);

export const listPatientAllergySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  query: z.object({
    search: z.string().optional(),
  }),
});

export const createPatientAllergySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  body: z.object({
    allergyName: z.string().min(1),
    allergyId: z.number().int().optional(),
    status: z.number().int().optional(),
  }),
});

export const updatePatientAllergySchema = z.object({
  params: z.object({
    patientId: numericId,
    paId: numericId,
  }),
  body: z.object({
    allergyName: z.string().optional(),
    allergyId: z.number().int().optional(),
    status: z.number().int().optional(),
  }).refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  }),
});

export const getPatientAllergySchema = z.object({
  params: z.object({
    patientId: numericId,
    paId: numericId,
  }),
});
