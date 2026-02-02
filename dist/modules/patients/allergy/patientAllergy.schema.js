"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientAllergySchema = exports.updatePatientAllergySchema = exports.createPatientAllergySchema = exports.listPatientAllergySchema = void 0;
const zod_1 = require("zod");
const numericId = zod_1.z.string().regex(/^\d+$/).transform(Number);
exports.listPatientAllergySchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
    }),
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
    }),
});
exports.createPatientAllergySchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
    }),
    body: zod_1.z.object({
        allergyName: zod_1.z.string().min(1),
        allergyId: zod_1.z.number().int().optional(),
        status: zod_1.z.number().int().optional(),
    }),
});
exports.updatePatientAllergySchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
        paId: numericId,
    }),
    body: zod_1.z.object({
        allergyName: zod_1.z.string().optional(),
        allergyId: zod_1.z.number().int().optional(),
        status: zod_1.z.number().int().optional(),
    }).refine((data) => Object.values(data).some((v) => v !== undefined), {
        message: 'At least one field must be provided',
    }),
});
exports.getPatientAllergySchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
        paId: numericId,
    }),
});
