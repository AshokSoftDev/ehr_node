import { prisma } from '../../utils/prisma';
import { Appointment, Prisma } from '@prisma/client';
import { AppointmentFilters, CreateAppointmentDto, UpdateAppointmentDto, PaginatedAppointmentsResponse, AppointmentSnapshot } from './appointment.types';

export class AppointmentRepository {
  async searchMrn(search: string) {
    return prisma.patient.findMany({
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
    return prisma.doctor.findMany({
      where: { status: 1 },
      select: { id: true, displayName: true, specialty: true },
      orderBy: { displayName: 'asc' },
    });
  }

  async list(filters: AppointmentFilters = {}): Promise<PaginatedAppointmentsResponse<any>> {
    const { search, mrn, patientName, doctorName, dateFrom, dateTo, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const orSearch: Prisma.AppointmentWhereInput[] = [];
    if (search) {
      orSearch.push({ patient: { OR: [
        { mrn: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ]}});
      orSearch.push({ doctor: { OR: [
        { displayName: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { specialty: { contains: search, mode: 'insensitive' } },
      ]}});
    }

    const where: Prisma.AppointmentWhereInput = {
      status: 1,
      ...(dateFrom || dateTo ? { appointment_date: {
        gte: dateFrom ?? undefined,
        lte: dateTo ?? undefined,
      }} : {}),
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
      prisma.appointment.findMany({
        where,
        include: {
          patient: { select: { patient_id: true, mrn: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, displayName: true, specialty: true } },
        },
        orderBy: { appointment_date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      appointments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(data: CreateAppointmentDto & AppointmentSnapshot & { createdBy?: string; updatedBy?: string }): Promise<Appointment> {
    return prisma.appointment.create({ data });
  }

  async update(id: number, data: UpdateAppointmentDto & Partial<AppointmentSnapshot> & { updatedBy?: string }): Promise<Appointment> {
    return prisma.appointment.update({ where: { appointment_id: id }, data });
  }

  async softDelete(id: number, deletedBy?: string): Promise<Appointment> {
    return prisma.appointment.update({
      where: { appointment_id: id },
      data: { status: 0, deletedAt: new Date(), deletedBy: deletedBy ?? null },
    });
  }
}
