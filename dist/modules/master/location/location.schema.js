"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocationSchema = exports.updateLocationSchema = exports.createLocationSchema = exports.listLocationSchema = void 0;
const zod_1 = require("zod");
exports.listLocationSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
    }),
});
exports.createLocationSchema = zod_1.z.object({
    body: zod_1.z.object({
        location_name: zod_1.z.string().min(1),
        address: zod_1.z.string().optional(),
        city: zod_1.z.string().min(1),
        state: zod_1.z.string().min(1),
    }),
});
exports.updateLocationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        location_id: zod_1.z.number().int().optional(),
        location_name: zod_1.z.string().min(1).optional(),
        address: zod_1.z.string().optional(),
        city: zod_1.z.string().min(1).optional(),
        state: zod_1.z.string().min(1).optional(),
        status: zod_1.z.number().int().min(0).max(1).optional(),
        active: zod_1.z.boolean().optional(),
    }),
});
exports.deleteLocationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
});
