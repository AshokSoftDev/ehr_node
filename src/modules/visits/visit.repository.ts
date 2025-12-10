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
      patient_id,
      reason,
      status,
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;

    const normalizedDoctor = typeof doctor === 'string' ? doctor.trim() : undefined;
    const ignoreDoctor = !normalizedDoctor || normalizedDoctor.toLowerCase() === 'none';
    const normalizedStatus = typeof status === 'string' && status !== '' ? Number(status) : undefined;
    const statusFilter = Number.isFinite(normalizedStatus) ? normalizedStatus : undefined;

    const where: any = {
      ...(statusFilter !== undefined ? { status: statusFilter } : { status: 1 }),
      ...(dateFrom || dateTo
        ? {
          visit_date: {
            gte: dateFrom ?? undefined,
            lte: dateTo ?? undefined,
          },
        }
        : {}),
      ...(reason
        ? { reason_for_visit: { contains: reason, mode: 'insensitive' } }
        : {}),
      patient: {
        activeStatus: 1,
        // Direct patient_id filter takes precedence
        ...(patient_id
          ? { patient_id: patient_id }
          : patient
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

    const include: any = {
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
      appointment: {
        select: {
          appointment_id: true,
          appointment_type: true,
        },
      },
    };

    const client = prisma as any;

    const [visits, total] = await Promise.all([
      client.visit.findMany({
        where,
        include,
        orderBy: { visit_date: 'desc' },
        skip,
        take: limit,
      }),
      client.visit.count({ where }),
    ]);

    return {
      visits,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
