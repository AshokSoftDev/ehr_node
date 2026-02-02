"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDrugSchema = exports.updateDrugSchema = exports.createDrugSchema = exports.listDrugSchema = void 0;
const zod_1 = require("zod");
exports.listDrugSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
    }),
});
exports.createDrugSchema = zod_1.z.object({
    body: zod_1.z.object({
        drug_generic: zod_1.z.string().min(1),
        drug_name: zod_1.z.string().min(1),
        drug_type: zod_1.z.string().min(1),
        drug_dosage: zod_1.z.string().min(1),
        drug_measure: zod_1.z.string().min(1),
        amount: zod_1.z.number().min(0.01),
        instruction: zod_1.z.string().optional(),
    }),
});
exports.updateDrugSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        drug_generic: zod_1.z.string().min(1).optional(),
        drug_name: zod_1.z.string().min(1).optional(),
        drug_type: zod_1.z.string().min(1).optional(),
        drug_dosage: zod_1.z.string().min(1).optional(),
        drug_measure: zod_1.z.string().min(1).optional(),
        amount: zod_1.z.number().min(0.01).optional(),
        instruction: zod_1.z.string().optional(),
        status: zod_1.z.number().int().min(0).max(1).optional(),
    }),
});
exports.deleteDrugSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
});
