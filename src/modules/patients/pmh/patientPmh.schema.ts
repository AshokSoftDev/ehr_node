import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);

export const listPatientPmhSchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
});

export const syncPatientPmhSchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  body: z.array(z.object({
    id: z.number().int().optional(),
    pmhId: z.number().int(),
    month: z.number().int().optional().nullable(),
    year: z.number().int().optional().nullable(),
    comments: z.string().optional().nullable(),
    status: z.number().int().optional(),
  })),
});
