import { prisma } from '../../../utils/prisma';
import { Prisma } from '@prisma/client';

export class PatientFamilyHistoryRepository {
  async list(patientId: number) {
    return prisma.patientFamilyHistory.findMany({
      where: {
        patient_id: patientId,
        deletedAt: null,
      },
      include: {
        familyDisease: true,
      },
      orderBy: { familyDisease: { diseaseName: 'asc' } },
    });
  }

  async findById(id: number) {
    return prisma.patientFamilyHistory.findUnique({
      where: { id },
      include: { familyDisease: true },
    });
  }

  async createMany(data: (Prisma.PatientFamilyHistoryCreateManyInput)[]) {
    return prisma.patientFamilyHistory.createMany({
      data,
    });
  }

  async update(id: number, data: Prisma.PatientFamilyHistoryUpdateInput) {
    return prisma.patientFamilyHistory.update({
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
