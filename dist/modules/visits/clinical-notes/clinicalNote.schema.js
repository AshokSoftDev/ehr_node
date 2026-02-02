"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clinicalNoteParamsSchema = exports.listClinicalNotesSchema = exports.updateClinicalNoteSchema = exports.createClinicalNoteSchema = void 0;
const zod_1 = require("zod");
const notesTypeEnum = zod_1.z.enum(['text', 'audio']);
const numericId = zod_1.z.string().regex(/^\d+$/).transform(Number);
exports.createClinicalNoteSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
    }),
    body: zod_1.z.object({
        notes_type: notesTypeEnum,
        editor_notes: zod_1.z.string().optional(),
    }).superRefine((body, ctx) => {
        if (body.notes_type === 'text' && (!body.editor_notes || body.editor_notes.trim() === '')) {
            ctx.addIssue({
                code: 'custom',
                path: ['editor_notes'],
                message: 'editor_notes is required when notes_type is text',
            });
        }
    }),
});
exports.updateClinicalNoteSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
        noteId: numericId,
    }),
    body: zod_1.z.object({
        editor_notes: zod_1.z.string().min(1, 'editor_notes is required'),
    }),
});
exports.listClinicalNotesSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
    }),
});
exports.clinicalNoteParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        visitId: numericId,
        noteId: numericId,
    }),
});
