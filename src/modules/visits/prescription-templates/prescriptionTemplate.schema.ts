import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);

export const createPrescriptionTemplateSchema = z.object({
  body: z.object({
    template_id: z.number().int().positive('template_id is required'),
    template_name: z.string().min(1, 'template_name is required'),
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
  }),
});

export const updatePrescriptionTemplateSchema = z.object({
  params: z.object({
    tempId: numericId,
  }),
  body: z.object({
    template_name: z.string().min(1).optional(),
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
  }),
});

export const listPrescriptionTemplatesSchema = z.object({
  query: z.object({
    template_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  }).optional(),
});

export const prescriptionTemplateParamsSchema = z.object({
  params: z.object({
    tempId: numericId,
  }),
});

export const bulkCreatePrescriptionTemplateSchema = z.object({
  body: z.object({
    templates: z.array(z.object({
      template_id: z.number().int().positive('template_id is required'),
      template_name: z.string().min(1, 'template_name is required'),
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
    })).min(1, 'At least one template item is required'),
  }),
});
