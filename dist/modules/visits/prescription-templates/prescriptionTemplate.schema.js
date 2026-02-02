"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreatePrescriptionTemplateSchema = exports.prescriptionTemplateParamsSchema = exports.listPrescriptionTemplatesSchema = exports.updatePrescriptionTemplateSchema = exports.createPrescriptionTemplateSchema = void 0;
const zod_1 = require("zod");
const numericId = zod_1.z.string().regex(/^\d+$/).transform(Number);
exports.createPrescriptionTemplateSchema = zod_1.z.object({
    body: zod_1.z.object({
        template_id: zod_1.z.number().int().positive('template_id is required'),
        template_name: zod_1.z.string().min(1, 'template_name is required'),
        drug_id: zod_1.z.number().int().positive().optional(),
        drug_name: zod_1.z.string().min(1, 'drug_name is required'),
        drug_generic: zod_1.z.string().optional(),
        drug_type: zod_1.z.string().optional(),
        drug_dosage: zod_1.z.string().optional(),
        drug_measure: zod_1.z.string().optional(),
        instruction: zod_1.z.string().optional(),
        duration: zod_1.z.number().int().positive().optional(),
        duration_type: zod_1.z.string().optional(),
        quantity: zod_1.z.number().int().positive().optional(),
        morning_bf: zod_1.z.boolean().optional(),
        morning_af: zod_1.z.boolean().optional(),
        noon_bf: zod_1.z.boolean().optional(),
        noon_af: zod_1.z.boolean().optional(),
        evening_bf: zod_1.z.boolean().optional(),
        evening_af: zod_1.z.boolean().optional(),
        night_bf: zod_1.z.boolean().optional(),
        night_af: zod_1.z.boolean().optional(),
        notes: zod_1.z.string().optional(),
    }),
});
exports.updatePrescriptionTemplateSchema = zod_1.z.object({
    params: zod_1.z.object({
        tempId: numericId,
    }),
    body: zod_1.z.object({
        template_name: zod_1.z.string().min(1).optional(),
        drug_id: zod_1.z.number().int().positive().optional(),
        drug_name: zod_1.z.string().min(1).optional(),
        drug_generic: zod_1.z.string().optional(),
        drug_type: zod_1.z.string().optional(),
        drug_dosage: zod_1.z.string().optional(),
        drug_measure: zod_1.z.string().optional(),
        instruction: zod_1.z.string().optional(),
        duration: zod_1.z.number().int().positive().optional(),
        duration_type: zod_1.z.string().optional(),
        quantity: zod_1.z.number().int().positive().optional(),
        morning_bf: zod_1.z.boolean().optional(),
        morning_af: zod_1.z.boolean().optional(),
        noon_bf: zod_1.z.boolean().optional(),
        noon_af: zod_1.z.boolean().optional(),
        evening_bf: zod_1.z.boolean().optional(),
        evening_af: zod_1.z.boolean().optional(),
        night_bf: zod_1.z.boolean().optional(),
        night_af: zod_1.z.boolean().optional(),
        notes: zod_1.z.string().optional(),
    }),
});
exports.listPrescriptionTemplatesSchema = zod_1.z.object({
    query: zod_1.z.object({
        template_id: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    }).optional(),
});
exports.prescriptionTemplateParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        tempId: numericId,
    }),
});
exports.bulkCreatePrescriptionTemplateSchema = zod_1.z.object({
    body: zod_1.z.object({
        templates: zod_1.z.array(zod_1.z.object({
            template_id: zod_1.z.number().int().positive('template_id is required'),
            template_name: zod_1.z.string().min(1, 'template_name is required'),
            drug_id: zod_1.z.number().int().positive().optional(),
            drug_name: zod_1.z.string().min(1, 'drug_name is required'),
            drug_generic: zod_1.z.string().optional(),
            drug_type: zod_1.z.string().optional(),
            drug_dosage: zod_1.z.string().optional(),
            drug_measure: zod_1.z.string().optional(),
            instruction: zod_1.z.string().optional(),
            duration: zod_1.z.number().int().positive().optional(),
            duration_type: zod_1.z.string().optional(),
            quantity: zod_1.z.number().int().positive().optional(),
            morning_bf: zod_1.z.boolean().optional(),
            morning_af: zod_1.z.boolean().optional(),
            noon_bf: zod_1.z.boolean().optional(),
            noon_af: zod_1.z.boolean().optional(),
            evening_bf: zod_1.z.boolean().optional(),
            evening_af: zod_1.z.boolean().optional(),
            night_bf: zod_1.z.boolean().optional(),
            night_af: zod_1.z.boolean().optional(),
            notes: zod_1.z.string().optional(),
        })).min(1, 'At least one template item is required'),
    }),
});
