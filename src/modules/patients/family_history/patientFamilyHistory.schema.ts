import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);

export const listPatientFamilyHistorySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
});

export const syncPatientFamilyHistorySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  body: z.array(z.object({
    id: z.number().int().optional(),
    familyDiseaseId: z.number().int(),
    mother: z.boolean().optional(),
    father: z.boolean().optional(),
    sisters: z.boolean().optional(),
    brothers: z.boolean().optional(),
    maternalMother: z.boolean().optional(),
    maternalFather: z.boolean().optional(),
    paternalMother: z.boolean().optional(),
    paternalFather: z.boolean().optional(),
    otherRelatives: z.string().optional().nullable(),
    comments: z.string().optional().nullable(),
    status: z.number().int().optional(),
  })),
});
