import { z } from 'zod';

export const createPatientSchema = z.object({
    body: z.object({
        title: z.string({ message: 'Title is required' }).min(1, 'Title is required'),
        firstName: z.string({ message: 'First name is required' }).min(1, 'First name is required'),
        lastName: z.string().optional(),
        dateOfBirth: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
        age: z.number().int().optional(),
        gender: z.string({ message: 'Gender is required' }).min(1, 'Gender is required'),
        mobileNumber: z.string({ message: 'Mobile number is required' }).regex(/^\d{10}$/, 'Invalid mobile number'),
        address: z.string().optional(),
        area: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        pincode: z.string().optional(),
        aadhar: z.string().optional(),
        referalSource: z.string().optional(),
        comments: z.string().optional(),
    }).superRefine((data, ctx) => {
        if (!data.dateOfBirth && data.age === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Either Date of Birth or Age must be provided',
                path: ['dateOfBirth'],
            });
        }
    }),
});

export const updatePatientSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/).transform(Number),
    }),
    body: z.object({
        title: z.string().min(1).optional(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().optional(),
        dateOfBirth: z.string().or(z.date()).transform((val) => val ? new Date(val) : undefined).optional(),
        age: z.number().int().optional(),
        gender: z.string().min(1).optional(),
        mobileNumber: z.string().regex(/^\d{10}$/, 'Invalid mobile number').optional(),
        address: z.string().optional(),
        area: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        pincode: z.string().optional(),
        aadhar: z.string().optional(),
        referalSource: z.string().optional(),
        comments: z.string().optional(),
        activeStatus: z.number().int().min(0).max(1).optional(),
    }).superRefine((data, ctx) => {
        if (data.dateOfBirth === undefined && data.age === undefined) {
            return;
        }
        if (!data.dateOfBirth && data.age === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Either Date of Birth or Age must be provided',
                path: ['dateOfBirth'],
            });
        }
    }),
});

export const getPatientSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/).transform(Number),
    }),
});

export const deletePatientSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/).transform(Number),
    }),
});

export const getAllPatientsSchema = z.object({
    query: z.object({
        search: z.string().optional(),
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
    }),
});
