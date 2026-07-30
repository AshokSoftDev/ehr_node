import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);

export const listPatientSocialHistorySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
});

export const syncPatientSocialHistorySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  body: z.array(
    z.object({
      id: z.number().int().optional(),
      socialMasterId: z.number().int(),
      selectedOption: z.number().int().min(1).max(2).optional().nullable(),
      comments: z.string().optional().nullable(),
      status: z.number().int().optional(),
    })
  ),
});
