import { z } from 'zod';

export const listAllergySchema = z.object({
  query: z.object({
    search: z.string().optional(),
  }),
});

export const createAllergySchema = z.object({
  body: z.object({
    allergyName: z.string().min(1),
    allergyType: z.string().min(1),
  }),
});

export const updateAllergySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    allergyName: z.string().min(1).optional(),
    allergyType: z.string().min(1).optional(),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const deleteAllergySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

