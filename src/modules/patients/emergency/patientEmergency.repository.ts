import { prisma } from '../../../utils/prisma';
import { Prisma } from '@prisma/client';

export class PatientEmergencyRepository {
  findPatient(patientId: number) {
    return prisma.patient.findUnique({
      where: { patient_id: patientId },
      select: { patient_id: true, activeStatus: true },
    });
  }

  list(patientId: number) {
    return prisma.patientEmergency.findMany({
      where: { patient_id: patientId, status: 1 },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(peId: number) {
    return prisma.patientEmergency.findUnique({
      where: { pe_id: peId },
    });
  }

  create(data: Prisma.PatientEmergencyUncheckedCreateInput) {
    return prisma.patientEmergency.create({ data });
  }

  update(peId: number, data: Prisma.PatientEmergencyUncheckedUpdateInput) {
    return prisma.patientEmergency.update({
      where: { pe_id: peId },
      data,
    });
  }
}
