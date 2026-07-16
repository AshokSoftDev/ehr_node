import { z } from 'zod';

export const listAppointmentTypeSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.coerce.number().optional(),
  }),
});

export const createAppointmentTypeSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    duration_minutes: z.number().int().min(1).default(30),
    color_code: z.string().optional(),
    status: z.number().int().default(1),
  }),
});

export const updateAppointmentTypeSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    code: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    duration_minutes: z.number().int().min(1).optional(),
    color_code: z.string().optional(),
    status: z.number().int().optional(),
  }),
});

export const deleteAppointmentTypeSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
