import { prisma } from '../../utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginatedVisitsResponse, VisitFilters } from './visit.types';

export class VisitRepository {
  async list(filters: VisitFilters = {}): Promise<PaginatedVisitsResponse<any>> {
    const {
      dateFrom,
      dateTo,
      doctor,
      doctor_id,
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
      // Direct doctor_id filter takes precedence over doctor name search
      ...(doctor_id
        ? { doctor_id: doctor_id }
        : !ignoreDoctor
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

  /**
   * Get aggregated status counts for appointments/visits
   * Categories: Scheduled, Pending, Notes Generated, Posted to EHR
   */
  async getStatusCounts(filters: { date?: Date; doctorId?: string } = {}) {
    const { date, doctorId } = filters;

    // Build where clause for appointments
    const where: any = {
      status: 1, // Only active appointments
    };

    // Filter by date if provided
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.appointment_date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // Filter by doctor if provided
    if (doctorId) {
      where.doctor_id = doctorId;
    }

    const client = prisma as any;

    // Get all appointments matching filters
    const appointments = await client.appointment.findMany({
      where,
      select: {
        appointment_id: true,
        appointment_status: true,
        clinicalNotes: {
          where: { status: 1 },
          select: { cn_id: true },
        },
      },
    });

    // Calculate counts based on appointment status and clinical notes existence
    let scheduled = 0;
    let pending = 0;
    let notesGenerated = 0;
    let postedToEHR = 0;

    for (const appt of appointments) {
      const status = appt.appointment_status?.toUpperCase() || '';
      const hasNotes = appt.clinicalNotes && appt.clinicalNotes.length > 0;

      // Scheduled: appointment is scheduled but not yet started
      if (status === 'SCHEDULED' || status === 'CONFIRMED') {
        scheduled++;
      }
      // Pending: appointment in progress but no notes yet
      else if ((status === 'WITH DOCTOR' || status === 'CHECKED_IN' || status === 'IN_PROGRESS') && !hasNotes) {
        pending++;
      }
      // Notes Generated: has clinical notes but not yet posted
      else if (hasNotes && status !== 'COMPLETED' && status !== 'POSTED') {
        notesGenerated++;
      }
      // Posted to EHR: completed with notes
      else if (status === 'COMPLETED' || status === 'POSTED') {
        postedToEHR++;
      }
    }

    return {
      scheduled,
      pending,
      notesGenerated,
      postedToEHR,
      total: appointments.length,
    };
  }
}
