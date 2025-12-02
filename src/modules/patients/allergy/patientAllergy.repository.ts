import { prisma } from '../../../utils/prisma';
import { Prisma } from '@prisma/client';

export class PatientAllergyRepository {
  findPatient(patientId: number) {
    return prisma.patient.findUnique({
      where: { patient_id: patientId },
      select: { patient_id: true, activeStatus: true },
    });
  }

  list(patientId: number, search?: string) {
    return prisma.patientAllergy.findMany({
      where: {
        patient_id: patientId,
        status: 1,
        ...(search
          ? {
              allergyName: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(paId: number) {
    return prisma.patientAllergy.findUnique({
      where: { id: paId },
    });
  }

  create(data: Prisma.PatientAllergyUncheckedCreateInput) {
    return prisma.patientAllergy.create({ data });
  }

  update(paId: number, data: Prisma.PatientAllergyUncheckedUpdateInput) {
    return prisma.patientAllergy.update({
      where: { id: paId },
      data,
    });
  }
}
