import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    fullName: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
    phoneNumber: z.string().optional(),
    groupId: z.string().uuid().optional(),
    dob: z.string().datetime().optional().transform(str => str ? new Date(str) : undefined),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    fullName: z.string().min(1).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phoneNumber: z.string().optional(),
    groupId: z.string().uuid().optional(),
    userStatus: z.number().int().min(0).max(1).optional(),
    dob: z.string().datetime().optional().transform(str => str ? new Date(str) : undefined),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    groupId: z.string().uuid().optional(),
    userStatus: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    accountType: z.string().optional(),
    parentId: z.string().uuid().optional(),
    search: z.string().optional(),
  }),
});
