"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientEmergencySchema = exports.createPatientEmergencySchema = exports.getPatientEmergencySchema = exports.listPatientEmergencySchema = void 0;
const zod_1 = require("zod");
const numericId = zod_1.z.string().regex(/^\d+$/).transform(Number);
const baseBody = {
    name: zod_1.z.string().min(1),
    relation: zod_1.z.string().min(1),
    contactNumber: zod_1.z.string().regex(/^\d{10}$/, 'contactNumber must be 10 digits'),
    status: zod_1.z.number().int().optional(),
};
exports.listPatientEmergencySchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
    }),
});
exports.getPatientEmergencySchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
        peId: numericId,
    }),
});
exports.createPatientEmergencySchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
    }),
    body: zod_1.z.object(baseBody),
});
exports.updatePatientEmergencySchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
        peId: numericId,
    }),
    body: zod_1.z.object({
        ...Object.fromEntries(Object.entries(baseBody).map(([key, schema]) => [key, schema.optional()])),
    }).refine((data) => Object.values(data).some((v) => v !== undefined), {
        message: 'At least one field must be provided',
    }),
});
