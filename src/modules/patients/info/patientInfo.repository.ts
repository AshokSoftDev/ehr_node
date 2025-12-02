import { prisma } from '../../../utils/prisma';
import { Prisma } from '@prisma/client';

export class PatientInfoRepository {
  findPatient(patientId: number) {
    return prisma.patient.findUnique({
      where: { patient_id: patientId },
      select: { patient_id: true, activeStatus: true },
    });
  }

  getByPatientId(patientId: number) {
    return prisma.patientInfo.findUnique({
      where: { patient_id: patientId },
    });
  }

  create(data: Prisma.PatientInfoUncheckedCreateInput) {
    return prisma.patientInfo.create({ data });
  }

  update(patientId: number, data: Prisma.PatientInfoUncheckedUpdateInput) {
    return prisma.patientInfo.update({
      where: { patient_id: patientId },
      data,
    });
  }
}
