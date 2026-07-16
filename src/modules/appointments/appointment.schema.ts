import { z } from 'zod';

const APPOINTMENT_STATUSES = [
  'SCHEDULED',
  'CONFIRMED',
  'CHECKED-IN',
  'CHECKED-OUT',
  'NO-SHOW',
  'WITH DOCTOR',
  'WAIT LIST',
  'CANCELLED',
] as const;

const statusField = z
  .string()
  .min(1)
  .transform((v) => v.toUpperCase())
  .pipe(z.enum(APPOINTMENT_STATUSES));

const toDate = (v: unknown) => {
  if (v == null || v === '') return undefined;
  if (v instanceof Date) return v;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? undefined : d;
};

export const listAppointmentsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    mrn: z.string().optional(),
    patientName: z.string().optional(),
    doctorName: z.string().optional(),
    doctor_id: z.string().uuid().or(z.string().min(1)).optional(),
    appointment_date: z.preprocess(toDate, z.date().optional()),
    status: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const listCheckedOutAppointmentsSchema = z.object({
  query: z.object({
    patient_id: z.string().regex(/^\d+$/).transform(Number).optional(),
    dateFrom: z.preprocess(toDate, z.date().optional()),
    dateTo: z.preprocess(toDate, z.date().optional()),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const searchMrnSchema = z.object({
  query: z.object({
    search: z.string().min(1),
  }),
});

export const doctorsListSchema = z.object({});

export const createAppointmentSchema = z.object({
  body: z.object({
    patient_id: z.number().int().positive(),
    doctor_id: z.string().uuid().or(z.string().min(1)),
    appointment_date: z.preprocess(toDate, z.date()),
    start_time: z.preprocess(toDate, z.date()),
    end_time: z.preprocess(toDate, z.date()),
    duration: z.number().int().positive().optional(),
    appointment_type: z.string().min(1),
    reason_for_visit: z.string().optional(),
    appointment_status: statusField,
    cancellation_reason: z.string().optional(),
    cancelled_by: z.string().optional(),
    notes: z.string().optional(),
  }).refine((data) => data.end_time > data.start_time, {
    message: 'end_time must be after start_time',
    path: ['end_time'],
  }).refine((data) => {
    if (data.appointment_status === 'CANCELLED') {
      if (!data.cancellation_reason || data.cancellation_reason.trim() === '') return false;
      if (!data.cancelled_by || data.cancelled_by.trim() === '') return false;
    }
    return true;
  }, {
    message: 'Cancellation reason and cancelled by are required when cancelling an appointment',
    path: ['cancellation_reason'],
  }),
});

export const updateAppointmentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    patient_id: z.number().int().positive().optional(),
    doctor_id: z.string().uuid().or(z.string().min(1)).optional(),
    appointment_date: z.preprocess(toDate, z.date().optional()),
    start_time: z.preprocess(toDate, z.date().optional()),
    end_time: z.preprocess(toDate, z.date().optional()),
    duration: z.number().int().positive().optional(),
    appointment_type: z.string().min(1).optional(),
    reason_for_visit: z.string().optional(),
    appointment_status: statusField.optional(),
    cancellation_reason: z.string().optional(),
    cancelled_by: z.string().optional(),
    notes: z.string().optional(),
  }).refine((data) => {
    if (!data.start_time || !data.end_time) return true;
    return data.end_time > data.start_time;
  }, {
    message: 'end_time must be after start_time',
    path: ['end_time'],
  }).refine((data) => {
    if (data.appointment_status === 'CANCELLED') {
      if (!data.cancellation_reason || data.cancellation_reason.trim() === '') return false;
      if (!data.cancelled_by || data.cancelled_by.trim() === '') return false;
    }
    return true;
  }, {
    message: 'Cancellation reason and cancelled by are required when cancelling an appointment',
    path: ['cancellation_reason'],
  }),
});

export const deleteAppointmentSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/).transform(Number) }),
});
