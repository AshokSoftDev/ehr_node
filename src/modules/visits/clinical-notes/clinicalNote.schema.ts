import { z } from 'zod';

const notesTypeEnum = z.enum(['text', 'audio']);

const numericId = z.string().regex(/^\d+$/).transform(Number);

export const createClinicalNoteSchema = z.object({
  params: z.object({
    visitId: numericId,
  }),
  body: z.object({
    notes_type: notesTypeEnum,
    editor_notes: z.string().optional(),
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

export const updateClinicalNoteSchema = z.object({
  params: z.object({
    visitId: numericId,
    noteId: numericId,
  }),
  body: z.object({
    editor_notes: z.string().min(1, 'editor_notes is required'),
  }),
});

export const listClinicalNotesSchema = z.object({
  params: z.object({
    visitId: numericId,
  }),
});

export const clinicalNoteParamsSchema = z.object({
  params: z.object({
    visitId: numericId,
    noteId: numericId,
  }),
});
