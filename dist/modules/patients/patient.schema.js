"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPatientsSchema = exports.deletePatientSchema = exports.getPatientSchema = exports.updatePatientSchema = exports.createPatientSchema = void 0;
const zod_1 = require("zod");
exports.createPatientSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        firstName: zod_1.z.string().min(1, 'First name is required'),
        lastName: zod_1.z.string().min(1, 'Last name is required'),
        dateOfBirth: zod_1.z.string().or(zod_1.z.date()).transform((val) => new Date(val)).optional(),
        age: zod_1.z.number().int().optional(),
        gender: zod_1.z.string().min(1, 'Gender is required'),
        mobileNumber: zod_1.z.string().regex(/^\d{10}$/, 'Invalid mobile number'),
        address: zod_1.z.string().min(1, 'Address is required'),
        area: zod_1.z.string().min(1, 'Area is required'),
        city: zod_1.z.string().min(1, 'City is required'),
        state: zod_1.z.string().min(1, 'State is required'),
        country: zod_1.z.string().min(1, 'Country is required'),
        pincode: zod_1.z.string().min(1, 'Pincode is required'),
        aadhar: zod_1.z.string().optional(),
        referalSource: zod_1.z.string().optional(),
        comments: zod_1.z.string().optional(),
    }).superRefine((data, ctx) => {
        if (!data.dateOfBirth && data.age === undefined) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Either Date of Birth or Age must be provided',
                path: ['dateOfBirth'],
            });
        }
    }),
});
exports.updatePatientSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        firstName: zod_1.z.string().min(1).optional(),
        lastName: zod_1.z.string().min(1).optional(),
        dateOfBirth: zod_1.z.string().or(zod_1.z.date()).transform((val) => val ? new Date(val) : undefined).optional(),
        age: zod_1.z.number().int().optional(),
        gender: zod_1.z.string().min(1).optional(),
        mobileNumber: zod_1.z.string().regex(/^\d{10}$/, 'Invalid mobile number').optional(),
        address: zod_1.z.string().min(1).optional(),
        area: zod_1.z.string().min(1).optional(),
        city: zod_1.z.string().min(1).optional(),
        state: zod_1.z.string().min(1).optional(),
        country: zod_1.z.string().min(1).optional(),
        pincode: zod_1.z.string().min(1).optional(),
        aadhar: zod_1.z.string().optional(),
        referalSource: zod_1.z.string().optional(),
        comments: zod_1.z.string().optional(),
        activeStatus: zod_1.z.number().int().min(0).max(1).optional(),
    }).superRefine((data, ctx) => {
        if (data.dateOfBirth === undefined && data.age === undefined) {
            return;
        }
        if (!data.dateOfBirth && data.age === undefined) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Either Date of Birth or Age must be provided',
                path: ['dateOfBirth'],
            });
        }
    }),
});
exports.getPatientSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
});
exports.deletePatientSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
});
exports.getAllPatientsSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
        page: zod_1.z.string().regex(/^\d+$/).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).optional(),
    }),
});
