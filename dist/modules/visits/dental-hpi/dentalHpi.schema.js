"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dentalHpiParamsSchema = exports.listDentalHpiSchema = exports.updateDentalHpiSchema = exports.createDentalHpiSchema = void 0;
const zod_1 = require("zod");
const numericId = zod_1.z.string().regex(/^\d+$/).transform(Number);
// Teeth surfaces schema: { "18": ["center", "leftTop"], "17": ["center"] }
const teethSurfacesSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.array(zod_1.z.enum(['center', 'leftTop', 'rightTop', 'leftBottom', 'rightBottom'])));
// Chief complaints schema: array of complaint IDs
const chiefComplaintsSchema = zod_1.z.array(zod_1.z.string().min(1));
const dentalHpiBodySchema = zod_1.z.object({
    dentition_type: zod_1.z.enum(['primary', 'mixed', 'permanent']),
    teeth_surfaces: teethSurfacesSchema,
    chief_complaints: chiefComplaintsSchema.min(1, 'At least one chief complaint is required'),
    severity: zod_1.z.enum(['mild', 'moderate', 'severe']).optional(),
    duration_years: zod_1.z.number().int().min(0).optional().default(0),
    duration_months: zod_1.z.number().int().min(0).max(11).optional().default(0),
    duration_weeks: zod_1.z.number().int().min(0).max(3).optional().default(0),
    duration_days: zod_1.z.number().int().min(0).max(6).optional().default(0),
    notes: zod_1.z.string().optional(),
});
const dentalHpiUpdateBodySchema = zod_1.z.object({
    dentition_type: zod_1.z.enum(['primary', 'mixed', 'permanent']).optional(),
    teeth_surfaces: teethSurfacesSchema.optional(),
    chief_complaints: chiefComplaintsSchema.optional(),
    severity: zod_1.z.enum(['mild', 'moderate', 'severe']).optional().nullable(),
    duration_years: zod_1.z.number().int().min(0).optional(),
    duration_months: zod_1.z.number().int().min(0).max(11).optional(),
    duration_weeks: zod_1.z.number().int().min(0).max(3).optional(),
    duration_days: zod_1.z.number().int().min(0).max(6).optional(),
    notes: zod_1.z.string().optional().nullable(),
});
exports.createDentalHpiSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
    }),
    body: dentalHpiBodySchema,
});
exports.updateDentalHpiSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
        hpiId: numericId,
    }),
    body: dentalHpiUpdateBodySchema,
});
exports.listDentalHpiSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
    }),
});
exports.dentalHpiParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
        hpiId: numericId,
    }),
});
