import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);

const baseBody = {
  name: z.string().min(1),
  relation: z.string().min(1),
  contactNumber: z.string().regex(/^\d{10}$/, 'contactNumber must be 10 digits'),
  status: z.number().int().optional(),
};

export const listPatientEmergencySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
});

export const getPatientEmergencySchema = z.object({
  params: z.object({
    patientId: numericId,
    peId: numericId,
  }),
});

export const createPatientEmergencySchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  body: z.object(baseBody),
});

export const updatePatientEmergencySchema = z.object({
  params: z.object({
    patientId: numericId,
    peId: numericId,
  }),
  body: z.object({
    ...Object.fromEntries(Object.entries(baseBody).map(([key, schema]) => [key, (schema as z.ZodTypeAny).optional()])),
  }).refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  }),
});
