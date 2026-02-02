"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionParamsSchema = exports.listPrescriptionsSchema = exports.updatePrescriptionSchema = exports.bulkDeletePrescriptionSchema = exports.bulkUpdatePrescriptionSchema = exports.bulkCreatePrescriptionSchema = exports.createPrescriptionSchema = void 0;
const zod_1 = require("zod");
const numericId = zod_1.z.string().regex(/^\d+$/).transform(Number);
const prescriptionBodySchema = zod_1.z.object({
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
});
const prescriptionUpdateBodySchema = zod_1.z.object({
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
});
exports.createPrescriptionSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
    }),
    body: prescriptionBodySchema,
});
// Bulk create schema for multiple prescriptions
exports.bulkCreatePrescriptionSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
    }),
    body: zod_1.z.object({
        prescriptions: zod_1.z.array(prescriptionBodySchema).min(1, 'At least one prescription is required'),
    }),
});
// Bulk update schema for multiple prescriptions
exports.bulkUpdatePrescriptionSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
    }),
    body: zod_1.z.object({
        prescriptions: zod_1.z.array(prescriptionUpdateBodySchema.extend({
            prescription_id: zod_1.z.number().int().positive(),
        })).min(1, 'At least one prescription is required'),
    }),
});
// Bulk delete schema for multiple prescriptions
exports.bulkDeletePrescriptionSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
    }),
    body: zod_1.z.object({
        prescriptionIds: zod_1.z.array(zod_1.z.number().int().positive()).min(1, 'At least one prescription ID is required'),
    }),
});
exports.updatePrescriptionSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
        prescriptionId: numericId,
    }),
    body: prescriptionUpdateBodySchema,
});
exports.listPrescriptionsSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
    }),
});
exports.prescriptionParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
        prescriptionId: numericId,
    }),
});
