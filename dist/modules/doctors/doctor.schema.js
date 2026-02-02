"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDoctorsSchema = exports.deleteDoctorSchema = exports.getDoctorSchema = exports.updateDoctorSchema = exports.createDoctorSchema = void 0;
const zod_1 = require("zod");
const timeBlockValues = ['5min', '10min', '15min', '20min', '25min', '30min', '1hr', '1.5hr', '2hr', '3hr'];
exports.createDoctorSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        firstName: zod_1.z.string().min(1, 'First name is required'),
        lastName: zod_1.z.string().min(1, 'Last name is required'),
        dob: zod_1.z.string().or(zod_1.z.date()).transform((val) => new Date(val)),
        email: zod_1.z.string().email('Invalid email address'),
        licenceNo: zod_1.z.string().min(1, 'Licence number is required'),
        degree: zod_1.z.string().min(1, 'Degree is required'),
        specialty: zod_1.z.string().min(1, 'Specialty is required'),
        timeBlock: zod_1.z.enum(timeBlockValues).optional(),
        displayName: zod_1.z.string().min(1, 'Display name is required'),
        displayColor: zod_1.z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
        address: zod_1.z.string().optional(),
        area: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        country: zod_1.z.string().optional(),
        pincode: zod_1.z.string().optional(),
    }),
});
exports.updateDoctorSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid doctor ID'),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        firstName: zod_1.z.string().min(1).optional(),
        lastName: zod_1.z.string().min(1).optional(),
        dob: zod_1.z.string().or(zod_1.z.date()).transform((val) => val ? new Date(val) : undefined).optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        licenceNo: zod_1.z.string().min(1).optional(),
        degree: zod_1.z.string().min(1).optional(),
        specialty: zod_1.z.string().min(1).optional(),
        timeBlock: zod_1.z.enum(timeBlockValues).optional().nullable(),
        displayName: zod_1.z.string().min(1).optional(),
        displayColor: zod_1.z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
        address: zod_1.z.string().optional().nullable(),
        area: zod_1.z.string().optional().nullable(),
        city: zod_1.z.string().optional().nullable(),
        state: zod_1.z.string().optional().nullable(),
        country: zod_1.z.string().optional().nullable(),
        pincode: zod_1.z.string().optional().nullable(),
        status: zod_1.z.number().int().min(0).max(1).optional(),
    }),
});
exports.getDoctorSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid doctor ID'),
    }),
});
exports.deleteDoctorSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid doctor ID'),
    }),
});
exports.getAllDoctorsSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
        specialty: zod_1.z.string().optional(),
        status: zod_1.z.string().regex(/^[0-1]$/).optional(),
        email: zod_1.z.string().optional(),
        licenceNo: zod_1.z.string().optional(),
        page: zod_1.z.string().regex(/^\d+$/).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).optional(),
    }),
});
