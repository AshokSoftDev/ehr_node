"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientInfoSchema = exports.createPatientInfoSchema = exports.getPatientInfoSchema = void 0;
const zod_1 = require("zod");
const numericId = zod_1.z.string().regex(/^\d+$/).transform(Number);
const uuid = zod_1.z.string().uuid({ message: 'primaryDoctorId must be a valid UUID' });
const payloadBase = {
    bloodGroup: zod_1.z.string().min(1),
    overseas: zod_1.z.boolean(),
    passportNumber: zod_1.z.string().optional(),
    validityDate: zod_1.z.coerce.date().optional(),
    occupation: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    companyName: zod_1.z.string().optional(),
    designation: zod_1.z.string().optional(),
    employeeCode: zod_1.z.string().optional(),
    primaryDoctorId: uuid.optional(),
};
exports.getPatientInfoSchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
    }),
});
exports.createPatientInfoSchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
    }),
    body: zod_1.z.object(payloadBase),
});
exports.updatePatientInfoSchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: numericId,
    }),
    body: zod_1.z.object({
        ...Object.entries(payloadBase).reduce((acc, [key, schema]) => {
            acc[key] = schema.optional();
            return acc;
        }, {}),
    }).refine((data) => Object.values(data).some((v) => v !== undefined), {
        message: 'At least one field must be provided',
    }),
});
