import { z } from 'zod';

export const listSocialSchema = z.object({
  query: z.object({
    search: z.string().optional(),
  }),
});

export const createSocialSchema = z.object({
  body: z.object({
    socialName: z.string().min(1, 'Social name is required'),
    option1: z.string().min(1, 'Option 1 is required'),
    option2: z.string().min(1, 'Option 2 is required'),
    notes: z.string().optional(),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const updateSocialSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    socialName: z.string().min(1).optional(),
    option1: z.string().min(1).optional(),
    option2: z.string().min(1).optional(),
    notes: z.string().optional().nullable(),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const deleteSocialSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});
