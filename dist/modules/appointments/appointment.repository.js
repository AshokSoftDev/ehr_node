"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRepository = void 0;
const prisma_1 = require("../../utils/prisma");
class AppointmentRepository {
    async searchMrn(search) {
        return prisma_1.prisma.patient.findMany({
            where: {
                activeStatus: 1,
                OR: [
                    { mrn: { contains: search, mode: 'insensitive' } },
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                ],
            },
            select: { patient_id: true, mrn: true, firstName: true, lastName: true },
            take: 20,
        });
    }
    async getDoctors() {
        return prisma_1.prisma.doctor.findMany({
            where: { status: 1 },
            select: { id: true, displayName: true, specialty: true },
            orderBy: { displayName: 'asc' },
        });
    }
    async list(filters = {}) {
        const { search, mrn, patientName, doctorName, dateFrom, dateTo, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;
        const orSearch = [];
        if (search) {
            orSearch.push({ patient: { OR: [
                        { mrn: { contains: search, mode: 'insensitive' } },
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                    ] } });
            orSearch.push({ doctor: { OR: [
                        { displayName: { contains: search, mode: 'insensitive' } },
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        { specialty: { contains: search, mode: 'insensitive' } },
                    ] } });
        }
        const where = {
            status: 1,
            ...(dateFrom || dateTo ? { appointment_date: {
                    gte: dateFrom ?? undefined,
                    lte: dateTo ?? undefined,
                } } : {}),
            ...(orSearch.length ? { OR: orSearch } : {}),
            patient: {
                activeStatus: 1,
                ...(mrn ? { mrn: { contains: mrn, mode: 'insensitive' } } : {}),
                ...(patientName ? {
                    OR: [
                        { firstName: { contains: patientName, mode: 'insensitive' } },
                        { lastName: { contains: patientName, mode: 'insensitive' } },
                    ],
                } : {}),
            },
            doctor: doctorName ? {
                OR: [
                    { displayName: { contains: doctorName, mode: 'insensitive' } },
                    { firstName: { contains: doctorName, mode: 'insensitive' } },
                    { lastName: { contains: doctorName, mode: 'insensitive' } },
                    { specialty: { contains: doctorName, mode: 'insensitive' } },
                ],
            } : undefined,
        };
        const [appointments, total] = await Promise.all([
            prisma_1.prisma.appointment.findMany({
                where,
                include: {
                    patient: { select: { patient_id: true, mrn: true, firstName: true, lastName: true } },
                    doctor: { select: { id: true, displayName: true, specialty: true } },
                },
                orderBy: { appointment_date: 'desc' },
                skip,
                take: limit,
            }),
            prisma_1.prisma.appointment.count({ where }),
        ]);
        return {
            appointments,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async listCheckedOut(filters = {}) {
        const { patient_id, dateFrom, dateTo, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;
        const where = {
            status: 1,
            appointment_status: { equals: 'CHECKED-OUT', mode: 'insensitive' },
            ...(patient_id ? { patient_id } : {}),
            ...(dateFrom || dateTo
                ? {
                    appointment_date: {
                        gte: dateFrom ?? undefined,
                        lte: dateTo ?? undefined,
                    },
                }
                : {}),
        };
        const [appointments, total] = await Promise.all([
            prisma_1.prisma.appointment.findMany({
                where,
                orderBy: { appointment_date: 'desc' },
                skip,
                take: limit,
            }),
            prisma_1.prisma.appointment.count({ where }),
        ]);
        return {
            appointments,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async create(data) {
        return prisma_1.prisma.appointment.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.appointment.update({ where: { appointment_id: id }, data });
    }
    async softDelete(id, deletedBy) {
        return prisma_1.prisma.appointment.update({
            where: { appointment_id: id },
            data: { status: 0, deletedAt: new Date(), deletedBy: deletedBy ?? null },
        });
    }
}
exports.AppointmentRepository = AppointmentRepository;
