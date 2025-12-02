import { z } from 'zod';

const numericId = z.string().regex(/^\d+$/).transform(Number);
const uuid = z.string().uuid({ message: 'primaryDoctorId must be a valid UUID' });

const payloadBase = {
  bloodGroup: z.string().min(1),
  overseas: z.boolean(),
  passportNumber: z.string().optional(),
  validityDate: z.coerce.date().optional(),
  occupation: z.string().optional(),
  department: z.string().optional(),
  companyName: z.string().optional(),
  designation: z.string().optional(),
  employeeCode: z.string().optional(),
  primaryDoctorId: uuid.optional(),
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
