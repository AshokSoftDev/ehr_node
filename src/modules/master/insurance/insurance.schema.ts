import { z } from 'zod';

export const listInsuranceSchema = z.object({
  query: z.object({
    search: z.string().optional(),
  }),
});

export const createInsuranceSchema = z.object({
  body: z.object({
    type: z.string().min(1),
    company: z.string().min(1),
    policy: z.string().min(1),
    policyNo: z.string().min(1),
    validationFrom: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
    validationTo: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
    notes: z.string().optional().nullable(),
  }),
});

export const updateInsuranceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    type: z.string().min(1).optional(),
    company: z.string().min(1).optional(),
    policy: z.string().min(1).optional(),
    policyNo: z.string().min(1).optional(),
    validationFrom: z
      .union([z.string(), z.date()])
      .transform((v) => (v ? new Date(v as any) : undefined))
      .optional(),
    validationTo: z
      .union([z.string(), z.date()])
      .transform((v) => (v ? new Date(v as any) : undefined))
      .optional(),
    notes: z.string().optional().nullable(),
    status: z.number().int().min(0).max(1).optional(),
  }),
});

export const deleteInsuranceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

