import { z } from 'zod';

export const listLocationSchema = z.object({
  query: z.object({
    search: z.string().optional(),
  }),
});

export const createLocationSchema = z.object({
  body: z.object({
    location_name: z.string().min(1),
    address: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
  }),
});

export const updateLocationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    location_name: z.string().min(1).optional(),
    address: z.string().optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const deleteLocationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

