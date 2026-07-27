import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);

export const listPmhSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.string().optional().transform(val => val ? Number(val) : undefined),
  }),
});

export const createPmhSchema = z.object({
  body: z.object({
    conditionName: z.string().min(1, 'Condition name is required'),
    notes: z.string().optional().nullable(),
    status: z.number().int().optional(),
  }),
});

export const updatePmhSchema = z.object({
  params: z.object({
    id: numericId,
  }),
  body: z.object({
    conditionName: z.string().min(1).optional(),
    notes: z.string().optional().nullable(),
    status: z.number().int().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

export const getPmhSchema = z.object({
  params: z.object({
    id: numericId,
  }),
});
