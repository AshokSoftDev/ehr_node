import { z } from 'zod';

export const createSurgerySchema = z.object({
  body: z.object({
    surgeryName: z.string().min(1, 'Surgery name is required'),
    notes: z.string().optional(),
    status: z.number().int().min(0).max(1).optional().default(1),
  }),
});

export const updateSurgerySchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    surgeryName: z.string().min(1).optional(),
    notes: z.string().optional(),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const getSurgeryByIdSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
});

export const deleteSurgerySchema = getSurgeryByIdSchema;

export const listSurgerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.string().transform(Number).optional(),
  }).optional(),
});
