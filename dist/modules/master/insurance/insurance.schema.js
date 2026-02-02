"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInsuranceSchema = exports.updateInsuranceSchema = exports.createInsuranceSchema = exports.listInsuranceSchema = void 0;
const zod_1 = require("zod");
exports.listInsuranceSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
    }),
});
exports.createInsuranceSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.string().min(1),
        company: zod_1.z.string().min(1),
        policy: zod_1.z.string().min(1),
        policyNo: zod_1.z.string().min(1),
        validationFrom: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).transform((v) => new Date(v)),
        validationTo: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).transform((v) => new Date(v)),
        notes: zod_1.z.string().optional().nullable(),
    }),
});
exports.updateInsuranceSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        type: zod_1.z.string().min(1).optional(),
        company: zod_1.z.string().min(1).optional(),
        policy: zod_1.z.string().min(1).optional(),
        policyNo: zod_1.z.string().min(1).optional(),
        validationFrom: zod_1.z
            .union([zod_1.z.string(), zod_1.z.date()])
            .transform((v) => (v ? new Date(v) : undefined))
            .optional(),
        validationTo: zod_1.z
            .union([zod_1.z.string(), zod_1.z.date()])
            .transform((v) => (v ? new Date(v) : undefined))
            .optional(),
        notes: zod_1.z.string().optional().nullable(),
        status: zod_1.z.number().int().min(0).max(1).optional(),
    }),
});
exports.deleteInsuranceSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
});
