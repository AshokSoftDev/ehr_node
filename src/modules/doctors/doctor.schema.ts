import { z } from 'zod';

const timeBlockValues = ['5min', '10min', '15min', '20min', '25min', '30min', '1hr', '1.5hr', '2hr', '3hr'] as const;

export const createDoctorSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        dob: z.string().or(z.date()).transform((val) => new Date(val)),
        email: z.string().email('Invalid email address'),
        licenceNo: z.string().min(1, 'Licence number is required'),
        degree: z.string().min(1, 'Degree is required'),
        specialty: z.string().min(1, 'Specialty is required'),
        timeBlock: z.enum(timeBlockValues).optional(),
        displayName: z.string().min(1, 'Display name is required'),
        displayColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
        address: z.string().optional(),
        area: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        pincode: z.string().optional(),
    }),
});

export const updateDoctorSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid doctor ID'),
    }),
    body: z.object({
        title: z.string().min(1).optional(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        dob: z.string().or(z.date()).transform((val) => val ? new Date(val) : undefined).optional(),
        email: z.string().email('Invalid email address').optional(),
        licenceNo: z.string().min(1).optional(),
        degree: z.string().min(1).optional(),
        specialty: z.string().min(1).optional(),
        timeBlock: z.enum(timeBlockValues).optional().nullable(),
        displayName: z.string().min(1).optional(),
        displayColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
        address: z.string().optional().nullable(),
        area: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        state: z.string().optional().nullable(),
        country: z.string().optional().nullable(),
        pincode: z.string().optional().nullable(),
        status: z.number().int().min(0).max(1).optional(),
    }),
});

export const getDoctorSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid doctor ID'),
    }),
});

export const deleteDoctorSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid doctor ID'),
    }),
});

export const getAllDoctorsSchema = z.object({
    query: z.object({
        search: z.string().optional(),
        specialty: z.string().optional(),
        status: z.string().regex(/^[0-1]$/).optional(),
        email: z.string().optional(),
        licenceNo: z.string().optional(),
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
    }),
});
