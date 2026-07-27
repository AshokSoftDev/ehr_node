import { prisma } from '../../../utils/prisma';
import { Prisma } from '@prisma/client';

export class PatientPmhRepository {
  async list(patientId: number) {
    return prisma.patientPmh.findMany({
      where: {
        patient_id: patientId,
        deletedAt: null,
      },
      include: {
        pmh: true,
      },
      orderBy: { pmh: { conditionName: 'asc' } },
    });
  }

  async findById(id: number) {
    return prisma.patientPmh.findUnique({
      where: { id },
      include: { pmh: true },
    });
  }

  async createMany(data: (Prisma.PatientPmhCreateManyInput)[]) {
    return prisma.patientPmh.createMany({
      data,
    });
  }

  async update(id: number, data: Prisma.PatientPmhUpdateInput) {
    return prisma.patientPmh.update({
      where: { id },
      data,
    });
  }

  async findPatient(patientId: number) {
    return prisma.patient.findUnique({
      where: { patient_id: patientId },
    });
  }
}
