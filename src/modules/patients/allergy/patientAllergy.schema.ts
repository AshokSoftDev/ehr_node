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

const patientAllergyPayloadSchema = z.object({
  allergyName: z.string().min(1),
  allergyId: z.number().int().optional(),
  status: z.number().int().optional(),
  notes: z.string().optional(),
});

export const createPatientAllergySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  body: z.union([
    patientAllergyPayloadSchema,
    z.array(patientAllergyPayloadSchema).min(1),
  ]),
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
    notes: z.string().optional(),
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

export const syncPatientAllergiesSchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  body: z.array(z.object({
    id: z.number().int().optional(),
    allergyName: z.string().min(1),
    allergyId: z.number().int().optional().nullable(),
    status: z.number().int().optional(),
    notes: z.string().optional().nullable(),
  })),
});
