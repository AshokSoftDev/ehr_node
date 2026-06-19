import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);
const uuid = z.string().uuid({ message: 'primaryDoctorId must be a valid UUID' }).or(z.literal('')).transform(val => val === '' ? null : val);

const payloadBase = {
  bloodGroup: z.string().optional().nullable(),
  overseas: z.boolean().optional().nullable(),
  passportNumber: z.string().optional().nullable(),
  validityDate: z.coerce.date().optional().nullable(),
  occupation: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  employeeCode: z.string().optional().nullable(),
  primaryDoctorId: uuid.optional().nullable(),
};

export const getPatientInfoSchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
});

export const createPatientInfoSchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  body: z.object(payloadBase),
});

export const updatePatientInfoSchema = z.object({
  params: z.object({
    patientId: numericId,
  }),
  body: z.object({
    ...Object.entries(payloadBase).reduce((acc, [key, schema]) => {
      acc[key] = (schema as z.ZodTypeAny).optional();
      return acc;
    }, {} as Record<string, z.ZodTypeAny>),
  }).refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  }),
});
