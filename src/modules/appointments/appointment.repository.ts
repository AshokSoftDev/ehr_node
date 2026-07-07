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
      select: { 
        patient_id: true, 
        mrn: true, 
        firstName: true, 
        lastName: true,
        patientInfo: {
          select: { primaryDoctorId: true }
        }
      },
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
    console.log("repository list filters received:", filters);
    const { search, mrn, patientName, doctorName, appointment_date, startDate, endDate, status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const orSearch: Prisma.AppointmentWhereInput[] = [];
    if (search) {
      orSearch.push({ patient: { OR: [
        { mrn: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { mobileNumber: { contains: search, mode: 'insensitive' } },
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
      ...(appointment_date ? { appointment_date: {
        gte: new Date(new Date(appointment_date).setHours(0, 0, 0, 0)),
        lt: new Date(new Date(appointment_date).setHours(24, 0, 0, 0)),
      }} : startDate || endDate ? { appointment_date: {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lt: new Date(endDate) } : {}),
      }} : {}),
      ...(status && status !== 'ALL' ? { appointment_status: status.toUpperCase() } : {}),
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
    console.log("Prisma where clause:", JSON.stringify(where, null, 2));

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: { select: { patient_id: true, mrn: true, firstName: true, lastName: true, dateOfBirth: true, gender: true, mobileNumber: true } },
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

  async getStats(filters: AppointmentFilters = {}) {
    const { search, mrn, patientName, doctorName, appointment_date, startDate, endDate } = filters;
    const orSearch: Prisma.AppointmentWhereInput[] = [];
    if (search) {
      orSearch.push({ patient: { OR: [
        { mrn: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { mobileNumber: { contains: search, mode: 'insensitive' } },
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
      ...(appointment_date ? { appointment_date: {
        gte: new Date(new Date(appointment_date).setHours(0, 0, 0, 0)),
        lt: new Date(new Date(appointment_date).setHours(24, 0, 0, 0)),
      }} : startDate || endDate ? { appointment_date: {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lt: new Date(endDate) } : {}),
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

    const grouped = await prisma.appointment.groupBy({
      by: ['appointment_status'],
      where,
      _count: {
        appointment_status: true,
      }
    });

    return grouped.reduce((acc, curr) => {
      const status = curr.appointment_status || 'UNKNOWN';
      acc[status] = curr._count.appointment_status;
      return acc;
    }, {} as Record<string, number>);
  }

  async listCheckedOut(filters: { patient_id?: number; dateFrom?: Date; dateTo?: Date; page?: number; limit?: number } = {}) {
    const { patient_id, dateFrom, dateTo, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.AppointmentWhereInput = {
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
      prisma.appointment.findMany({
        where,
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
    const startOfDay = new Date(new Date(data.appointment_date).setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(data.appointment_date).setHours(24, 0, 0, 0));

    const lastAppt = await prisma.appointment.findFirst({
      where: {
        doctor_id: data.doctor_id,
        appointment_date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: { token: 'desc' },
      select: { token: true },
    });
    
    const token = (lastAppt?.token ?? 0) + 1;
    return prisma.appointment.create({ data: { ...data, token } });
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
