import { z } from 'zod';

export const listDrugSchema = z.object({
  query: z.object({
    search: z.string().optional(),
  }),
});

export const createDrugSchema = z.object({
  body: z.object({
    drug_generic: z.string().min(1),
    drug_name: z.string().min(1),
    drug_type: z.string().min(1),
    drug_dosage: z.string().min(1),
    drug_measure: z.string().min(1),
    instruction: z.string().optional(),
  }),
});

export const updateDrugSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    drug_generic: z.string().min(1).optional(),
    drug_name: z.string().min(1).optional(),
    drug_type: z.string().min(1).optional(),
    drug_dosage: z.string().min(1).optional(),
    drug_measure: z.string().min(1).optional(),
    instruction: z.string().optional(),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const deleteDrugSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

