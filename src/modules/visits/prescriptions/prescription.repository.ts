import { Prisma, Prescription } from '@prisma/client';
import { prisma } from '../../../utils/prisma';

export class PrescriptionRepository {
  findVisitById(visitId: number) {
    return prisma.visit.findUnique({
      where: { visit_id: visitId },
      select: {
        visit_id: true,
        patient_id: true,
        appointment_id: true,
        doctor_id: true,
        status: true,
      },
    });
  }

  create(data: Prisma.PrescriptionUncheckedCreateInput): Promise<Prescription> {
    return prisma.prescription.create({ data });
  }

  listByVisit(visitId: number): Promise<Prescription[]> {
    return prisma.prescription.findMany({
      where: { visit_id: visitId, status: 1 },
      orderBy: { createdAt: 'asc' },
    });
  }

  findById(prescriptionId: number): Promise<Prescription | null> {
    return prisma.prescription.findUnique({
      where: { prescription_id: prescriptionId },
    });
  }

  update(prescriptionId: number, data: Prisma.PrescriptionUncheckedUpdateInput): Promise<Prescription> {
    return prisma.prescription.update({
      where: { prescription_id: prescriptionId },
      data,
    });
  }
}
