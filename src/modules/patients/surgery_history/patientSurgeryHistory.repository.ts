import { prisma } from '../../../utils/prisma';
import { Prisma } from '@prisma/client';

export class PatientSurgeryHistoryRepository {
  async list(patientId: number) {
    return prisma.patientSurgeryHistory.findMany({
      where: {
        patient_id: patientId,
        deletedAt: null,
      },
      include: {
        surgery: true,
      },
      orderBy: { surgery: { surgeryName: 'asc' } },
    });
  }

  async findById(id: number) {
    return prisma.patientSurgeryHistory.findUnique({
      where: { id },
      include: { surgery: true },
    });
  }

  async createMany(data: (Prisma.PatientSurgeryHistoryCreateManyInput)[]) {
    return prisma.patientSurgeryHistory.createMany({
      data,
    });
  }

  async update(id: number, data: Prisma.PatientSurgeryHistoryUpdateInput) {
    return prisma.patientSurgeryHistory.update({
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
