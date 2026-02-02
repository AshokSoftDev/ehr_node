"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllergySchema = exports.updateAllergySchema = exports.createAllergySchema = exports.listAllergySchema = void 0;
const zod_1 = require("zod");
exports.listAllergySchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
    }),
});
exports.createAllergySchema = zod_1.z.object({
    body: zod_1.z.object({
        allergyName: zod_1.z.string().min(1),
        allergyType: zod_1.z.string().min(1),
    }),
});
exports.updateAllergySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        allergyName: zod_1.z.string().min(1).optional(),
        allergyType: zod_1.z.string().min(1).optional(),
        status: zod_1.z.number().int().min(0).max(1).optional(),
    }),
});
exports.deleteAllergySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
});
