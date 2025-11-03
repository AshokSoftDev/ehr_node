import { prisma } from '../../utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginatedVisitsResponse, VisitFilters } from './visit.types';

export class VisitRepository {
  async list(filters: VisitFilters = {}): Promise<PaginatedVisitsResponse<any>> {
    const {
      dateFrom,
      dateTo,
      doctor,
      patient,
      reason,
      status,
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;

    const normalizedDoctor = typeof doctor === 'string' ? doctor.trim() : undefined;
    const ignoreDoctor = !normalizedDoctor || normalizedDoctor.toLowerCase() === 'none';

    const where: Prisma.AppointmentWhereInput = {
      status: 1, // active (not soft-deleted)
      ...(dateFrom || dateTo
        ? {
            appointment_date: {
              gte: dateFrom ?? undefined,
              lte: dateTo ?? undefined,
            },
          }
        : {}),
      ...(reason
        ? { reason_for_visit: { contains: reason, mode: 'insensitive' } }
        : {}),
      ...(status
        ? { appointment_status: { contains: status, mode: 'insensitive' } }
        : {}),
      patient: {
        activeStatus: 1,
        ...(patient
          ? {
              OR: [
                { mrn: { contains: patient, mode: 'insensitive' } },
                { firstName: { contains: patient, mode: 'insensitive' } },
                { lastName: { contains: patient, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      ...(!ignoreDoctor
        ? {
            doctor: {
              OR: [
                { displayName: { contains: normalizedDoctor, mode: 'insensitive' } },
                { firstName: { contains: normalizedDoctor, mode: 'insensitive' } },
                { lastName: { contains: normalizedDoctor, mode: 'insensitive' } },
                { specialty: { contains: normalizedDoctor, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
    };

    const [visits, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: {
              patient_id: true,
              mrn: true,
              title: true,
              firstName: true,
              lastName: true,
              gender: true,
              age: true,
              mobileNumber: true,
            },
          },
          doctor: { select: { id: true, displayName: true, specialty: true } },
        },
        orderBy: { appointment_date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      visits,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
