"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDocumentsSchema = exports.documentParamsSchema = exports.updateDocumentSchema = exports.createDocumentSchema = void 0;
const zod_1 = require("zod");
exports.createDocumentSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: zod_1.z.string().transform(Number),
    }),
    body: zod_1.z.object({
        document_type_id: zod_1.z.string().transform(Number),
        type_name: zod_1.z.string().min(1, 'Type name is required'),
        description: zod_1.z.string().optional(),
    }),
});
exports.updateDocumentSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: zod_1.z.string().transform(Number),
        documentId: zod_1.z.string().transform(Number),
    }),
    body: zod_1.z.object({
        file_name: zod_1.z.string().min(1).optional(),
        document_type_id: zod_1.z.coerce.number().optional(),
        type_name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    }),
});
exports.documentParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: zod_1.z.string().transform(Number),
        documentId: zod_1.z.string().transform(Number),
    }),
});
exports.listDocumentsSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: zod_1.z.string().transform(Number),
    }),
});
