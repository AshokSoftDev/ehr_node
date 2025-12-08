import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);

const prescriptionBodySchema = z.object({
  drug_id: z.number().int().positive().optional(),
  drug_name: z.string().min(1, 'drug_name is required'),
  drug_generic: z.string().optional(),
  drug_type: z.string().optional(),
  drug_dosage: z.string().optional(),
  drug_measure: z.string().optional(),
  instruction: z.string().optional(),
  duration: z.number().int().positive().optional(),
  duration_type: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  morning_bf: z.boolean().optional(),
  morning_af: z.boolean().optional(),
  noon_bf: z.boolean().optional(),
  noon_af: z.boolean().optional(),
  evening_bf: z.boolean().optional(),
  evening_af: z.boolean().optional(),
  night_bf: z.boolean().optional(),
  night_af: z.boolean().optional(),
  notes: z.string().optional(),
});

const prescriptionUpdateBodySchema = z.object({
  drug_id: z.number().int().positive().optional(),
  drug_name: z.string().min(1).optional(),
  drug_generic: z.string().optional(),
  drug_type: z.string().optional(),
  drug_dosage: z.string().optional(),
  drug_measure: z.string().optional(),
  instruction: z.string().optional(),
  duration: z.number().int().positive().optional(),
  duration_type: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  morning_bf: z.boolean().optional(),
  morning_af: z.boolean().optional(),
  noon_bf: z.boolean().optional(),
  noon_af: z.boolean().optional(),
  evening_bf: z.boolean().optional(),
  evening_af: z.boolean().optional(),
  night_bf: z.boolean().optional(),
  night_af: z.boolean().optional(),
  notes: z.string().optional(),
});

export const createPrescriptionSchema = z.object({
  params: z.object({
    visitId: numericId,
  }),
  body: prescriptionBodySchema,
});

// Bulk create schema for multiple prescriptions
export const bulkCreatePrescriptionSchema = z.object({
  params: z.object({
    visitId: numericId,
  }),
  body: z.object({
    prescriptions: z.array(prescriptionBodySchema).min(1, 'At least one prescription is required'),
  }),
});

// Bulk update schema for multiple prescriptions
export const bulkUpdatePrescriptionSchema = z.object({
  params: z.object({
    visitId: numericId,
  }),
  body: z.object({
    prescriptions: z.array(
      prescriptionUpdateBodySchema.extend({
        prescription_id: z.number().int().positive(),
      })
    ).min(1, 'At least one prescription is required'),
  }),
});

// Bulk delete schema for multiple prescriptions
export const bulkDeletePrescriptionSchema = z.object({
  params: z.object({
    visitId: numericId,
  }),
  body: z.object({
    prescriptionIds: z.array(z.number().int().positive()).min(1, 'At least one prescription ID is required'),
  }),
});

export const updatePrescriptionSchema = z.object({
  params: z.object({
    visitId: numericId,
    prescriptionId: numericId,
  }),
  body: prescriptionUpdateBodySchema,
});

export const listPrescriptionsSchema = z.object({
  params: z.object({
    visitId: numericId,
  }),
});

export const prescriptionParamsSchema = z.object({
  params: z.object({
    visitId: numericId,
    prescriptionId: numericId,
  }),
});
