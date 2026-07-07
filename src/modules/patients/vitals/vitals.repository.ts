import { prisma } from '../../../utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginatedVitalsResponse, VitalFilters } from './vitals.types';

export class VitalsRepository {
  async list(filters: VitalFilters): Promise<PaginatedVitalsResponse> {
    const { patientId, visitId, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.PatientVitalWhereInput = {
      patient_id: patientId,
      status: 1,
    };

    if (visitId !== undefined) {
      where.visit_id = visitId;
    }

    const client = prisma as any;

    const [vitals, total] = await Promise.all([
      client.patientVital.findMany({
        where,
        orderBy: [{ vital_date: 'desc' }, { vital_id: 'desc' }],
        skip,
        take: limit,
        include: {
          visit: {
            select: {
              visit_id: true,
              visit_type: true,
              visit_date: true,
            }
          }
        }
      }),
      client.patientVital.count({ where }),
    ]);

    return {
      vitals,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(patientId: number, vitalId: number) {
    const client = prisma as any;
    return client.patientVital.findFirst({
      where: {
        patient_id: patientId,
        vital_id: vitalId,
        status: 1,
      },
      include: {
        visit: true
      }
    });
  }

  async create(data: Prisma.PatientVitalUncheckedCreateInput) {
    const client = prisma as any;
    return client.patientVital.create({
      data,
    });
  }

  async update(vitalId: number, data: Prisma.PatientVitalUncheckedUpdateInput) {
    const client = prisma as any;
    return client.patientVital.update({
      where: { vital_id: vitalId },
      data,
    });
  }

  async delete(vitalId: number, deletedBy: string) {
    const client = prisma as any;
    return client.patientVital.update({
      where: { vital_id: vitalId },
      data: {
        status: 0,
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }
}
