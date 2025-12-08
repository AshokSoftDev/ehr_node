import { z } from 'zod';

export const createDocumentSchema = z.object({
  params: z.object({
    visitId: z.string().transform(Number),
  }),
  body: z.object({
    document_type_id: z.string().transform(Number),
    type_name: z.string().min(1, 'Type name is required'),
    description: z.string().optional(),
  }),
});

export const updateDocumentSchema = z.object({
  params: z.object({
    visitId: z.string().transform(Number),
    documentId: z.string().transform(Number),
  }),
  body: z.object({
    file_name: z.string().min(1).optional(),
    document_type_id: z.coerce.number().optional(),
    type_name: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const documentParamsSchema = z.object({
  params: z.object({
    visitId: z.string().transform(Number),
    documentId: z.string().transform(Number),
  }),
});

export const listDocumentsSchema = z.object({
  params: z.object({
    visitId: z.string().transform(Number),
  }),
});
