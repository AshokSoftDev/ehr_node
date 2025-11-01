import { z } from 'zod';

export const listPatientAllergySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  query: z.object({
    search: z.string().optional(),
  }).optional(),
});

export const createPatientAllergySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    allergyName: z.string().min(1, 'Allergy name is required'),
    allergyId: z.number().int().optional(),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const updatePatientAllergySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
    paId: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z
    .object({
      allergyName: z.string().min(1).optional(),
      allergyId: z.number().int().optional(),
      status: z.number().int().min(0).max(1).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const deletePatientAllergySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
    paId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

