import { z } from 'zod';

export const createPatientSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        dateOfBirth: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
        age: z.number().int().optional(),
        gender: z.string().min(1, 'Gender is required'),
        mobileNumber: z.string().regex(/^\d{10}$/, 'Invalid mobile number'),
        address: z.string().min(1, 'Address is required'),
        area: z.string().min(1, 'Area is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        country: z.string().min(1, 'Country is required'),
        pincode: z.string().min(1, 'Pincode is required'),
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
        lastName: z.string().min(1).optional(),
        dateOfBirth: z.string().or(z.date()).transform((val) => val ? new Date(val) : undefined).optional(),
        age: z.number().int().optional(),
        gender: z.string().min(1).optional(),
        mobileNumber: z.string().regex(/^\d{10}$/, 'Invalid mobile number').optional(),
        address: z.string().min(1).optional(),
        area: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        state: z.string().min(1).optional(),
        country: z.string().min(1).optional(),
        pincode: z.string().min(1).optional(),
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
