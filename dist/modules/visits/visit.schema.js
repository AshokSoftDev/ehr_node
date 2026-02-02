"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listVisitsSchema = void 0;
const zod_1 = require("zod");
const toDate = (v) => {
    if (v == null || v === '')
        return undefined;
    if (v instanceof Date)
        return v;
    const d = new Date(String(v));
    return isNaN(d.getTime()) ? undefined : d;
};
exports.listVisitsSchema = zod_1.z.object({
    query: zod_1.z.object({
        dateFrom: zod_1.z.preprocess(toDate, zod_1.z.date().optional()),
        dateTo: zod_1.z.preprocess(toDate, zod_1.z.date().optional()),
        doctor: zod_1.z.string().optional(),
        patient: zod_1.z.string().optional(), // name or MRN
        reason: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(), // appointment_status
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    }),
});
