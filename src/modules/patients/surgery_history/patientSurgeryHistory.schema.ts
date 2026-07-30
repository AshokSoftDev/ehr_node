import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);

export const listPatientSurgeryHistorySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
});

export const syncPatientSurgeryHistorySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  body: z.array(z.object({
    id: z.number().int().optional(),
    surgeryId: z.number().int(),
    month: z.number().int().optional().nullable(),
    year: z.number().int().optional().nullable(),
    comments: z.string().optional().nullable(),
    status: z.number().int().optional(),
  })),
});
