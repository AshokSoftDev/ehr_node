import { z } from 'zod';

export const createDocumentTypeSchema = z.object({
  body: z.object({
    type_name: z.string().min(1, 'Type name is required'),
    description: z.string().optional(),
  }),
});

export const updateDocumentTypeSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    type_name: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.number().optional(),
  }),
});

export const documentTypeIdSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
});

export const listDocumentTypesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.string().optional(),
  }).optional(),
});
