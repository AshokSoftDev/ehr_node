import { z } from 'zod';

export const pathWithPatientId = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const createPatientInfoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    bloodGroup: z.string().min(1, 'Blood group is required'),
    overseas: z.boolean(),
    passportNumber: z.string().optional().nullable(),
    validityDate: z
      .union([z.string(), z.date()])
      .transform((v) => (v ? new Date(v as any) : null))
      .optional()
      .nullable(),
    occupation: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    companyName: z.string().optional().nullable(),
    designation: z.string().optional().nullable(),
    employeeCode: z.string().optional().nullable(),
    primaryDoctorId: z.string().uuid().optional().nullable(),
  }),
});

export const updatePatientInfoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z
    .object({
      bloodGroup: z.string().min(1).optional(),
      overseas: z.boolean().optional(),
      passportNumber: z.string().optional().nullable(),
      validityDate: z
        .union([z.string(), z.date()])
        .transform((v) => (v ? new Date(v as any) : null))
        .optional()
        .nullable(),
      occupation: z.string().optional().nullable(),
      department: z.string().optional().nullable(),
      companyName: z.string().optional().nullable(),
      designation: z.string().optional().nullable(),
      employeeCode: z.string().optional().nullable(),
      primaryDoctorId: z.string().uuid().optional().nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const getPatientInfoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

