import { z } from 'zod';

export const listFamilyDiseaseSchema = z.object({
  query: z.object({
    search: z.string().optional(),
  }),
});

export const createFamilyDiseaseSchema = z.object({
  body: z.object({
    diseaseName: z.string().min(1, 'Disease name is required'),
    notes: z.string().optional(),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const updateFamilyDiseaseSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    diseaseName: z.string().min(1).optional(),
    notes: z.string().optional().nullable(),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const deleteFamilyDiseaseSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});
