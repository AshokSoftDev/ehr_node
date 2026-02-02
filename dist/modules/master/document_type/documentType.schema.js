"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDocumentTypesSchema = exports.documentTypeIdSchema = exports.updateDocumentTypeSchema = exports.createDocumentTypeSchema = void 0;
const zod_1 = require("zod");
exports.createDocumentTypeSchema = zod_1.z.object({
    body: zod_1.z.object({
        type_name: zod_1.z.string().min(1, 'Type name is required'),
        description: zod_1.z.string().optional(),
    }),
});
exports.updateDocumentTypeSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().transform(Number),
    }),
    body: zod_1.z.object({
        type_name: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.number().optional(),
    }),
});
exports.documentTypeIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().transform(Number),
    }),
});
exports.listDocumentTypesSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
    }).optional(),
});
