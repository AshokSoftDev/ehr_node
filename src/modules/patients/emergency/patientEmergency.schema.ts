import { z } from 'zod';

export const createPatientEmergencySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    relation: z.string().min(1, 'Relation is required'),
    contactNumber: z.string().regex(/^\d{10}$/i, 'Invalid contact number'),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const updatePatientEmergencySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
    peId: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z
    .object({
      name: z.string().min(1).optional(),
      relation: z.string().min(1).optional(),
      contactNumber: z.string().regex(/^\d{10}$/i, 'Invalid contact number').optional(),
      status: z.number().int().min(0).max(1).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const getPatientEmergencySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
    peId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const listPatientEmergencySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const deletePatientEmergencySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
    peId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

