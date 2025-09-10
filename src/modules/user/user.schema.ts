import { z } from 'zod';

const uuidSchema = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  "Invalid UUID"
);
const dateSchema = z.union([
  z.coerce.date(), // parses ISO string -> Date
  z.null(),
]).optional();


export const createUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.email(),
    phoneNumber: z.string().optional().nullable(),
    groupId: uuidSchema.optional(),
    password: z.string().min(8),
    createdBy: z.string().optional(),
    dob: dateSchema,
    userStatus: z.number().int().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: uuidSchema }),
  body: z.object({
    fullName: z.string().min(1).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.email().optional(),
    phoneNumber: z.string().optional().nullable(),
    groupId: uuidSchema.optional(),
    password: z.string().min(8).optional(),
    updatedBy: z.string().optional(),
    dob: dateSchema,
    userStatus: z.number().int().optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({ id: uuidSchema }),
});