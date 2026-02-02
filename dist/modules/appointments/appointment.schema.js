"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointmentSchema = exports.updateAppointmentSchema = exports.createAppointmentSchema = exports.doctorsListSchema = exports.searchMrnSchema = exports.listCheckedOutAppointmentsSchema = exports.listAppointmentsSchema = void 0;
const zod_1 = require("zod");
const APPOINTMENT_STATUSES = [
    'SCHEDULED',
    'CONFIRMED',
    'CHECKED-IN',
    'CHECKED-OUT',
    'NO-SHOW',
    'WITH DOCTOR',
    'WAIT LIST',
    'CANCELLED',
];
const statusField = zod_1.z
    .string()
    .min(1)
    .transform((v) => v.toUpperCase())
    .pipe(zod_1.z.enum(APPOINTMENT_STATUSES));
const toDate = (v) => {
    if (v == null || v === '')
        return undefined;
    if (v instanceof Date)
        return v;
    const d = new Date(String(v));
    return isNaN(d.getTime()) ? undefined : d;
};
exports.listAppointmentsSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
        mrn: zod_1.z.string().optional(),
        patientName: zod_1.z.string().optional(),
        doctorName: zod_1.z.string().optional(),
        dateFrom: zod_1.z.preprocess(toDate, zod_1.z.date().optional()),
        dateTo: zod_1.z.preprocess(toDate, zod_1.z.date().optional()),
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    }),
});
exports.listCheckedOutAppointmentsSchema = zod_1.z.object({
    query: zod_1.z.object({
        patient_id: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        dateFrom: zod_1.z.preprocess(toDate, zod_1.z.date().optional()),
        dateTo: zod_1.z.preprocess(toDate, zod_1.z.date().optional()),
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    }),
});
exports.searchMrnSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().min(1),
    }),
});
exports.doctorsListSchema = zod_1.z.object({});
exports.createAppointmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        patient_id: zod_1.z.number().int().positive(),
        doctor_id: zod_1.z.string().uuid().or(zod_1.z.string().min(1)),
        appointment_date: zod_1.z.preprocess(toDate, zod_1.z.date()),
        start_time: zod_1.z.preprocess(toDate, zod_1.z.date()),
        end_time: zod_1.z.preprocess(toDate, zod_1.z.date()),
        duration: zod_1.z.number().int().positive().optional(),
        appointment_type: zod_1.z.string().min(1),
        reason_for_visit: zod_1.z.string().optional(),
        appointment_status: statusField,
        notes: zod_1.z.string().optional(),
    }).refine((data) => data.end_time > data.start_time, {
        message: 'end_time must be after start_time',
        path: ['end_time'],
    }),
});
exports.updateAppointmentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        patient_id: zod_1.z.number().int().positive().optional(),
        doctor_id: zod_1.z.string().uuid().or(zod_1.z.string().min(1)).optional(),
        appointment_date: zod_1.z.preprocess(toDate, zod_1.z.date().optional()),
        start_time: zod_1.z.preprocess(toDate, zod_1.z.date().optional()),
        end_time: zod_1.z.preprocess(toDate, zod_1.z.date().optional()),
        duration: zod_1.z.number().int().positive().optional(),
        appointment_type: zod_1.z.string().min(1).optional(),
        reason_for_visit: zod_1.z.string().optional(),
        appointment_status: statusField.optional(),
        notes: zod_1.z.string().optional(),
    }).refine((data) => {
        if (!data.start_time || !data.end_time)
            return true;
        return data.end_time > data.start_time;
    }, {
        message: 'end_time must be after start_time',
        path: ['end_time'],
    }),
});
exports.deleteAppointmentSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/).transform(Number) }),
});
