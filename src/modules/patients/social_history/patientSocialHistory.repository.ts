import { prisma } from '../../../utils/prisma';
import { Prisma } from '@prisma/client';

export class PatientSocialHistoryRepository {
  async list(patientId: number) {
    return prisma.patientSocialHistory.findMany({
      where: {
        patient_id: patientId,
        deletedAt: null,
      },
      include: {
        socialMaster: true,
      },
      orderBy: { socialMaster: { socialName: 'asc' } },
    });
  }

  async findById(id: number) {
    return prisma.patientSocialHistory.findUnique({
      where: { id },
      include: { socialMaster: true },
    });
  }

  async createMany(data: Prisma.PatientSocialHistoryCreateManyInput[]) {
    return prisma.patientSocialHistory.createMany({
      data,
    });
  }

  async update(id: number, data: Prisma.PatientSocialHistoryUpdateInput) {
    return prisma.patientSocialHistory.update({
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
