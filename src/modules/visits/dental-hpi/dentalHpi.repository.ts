import { Prisma } from '@prisma/client';
import { prisma } from '../../../utils/prisma';

export class DentalHpiRepository {
  findVisitById(visitId: number) {
    return prisma.visit.findUnique({
      where: { visit_id: visitId },
      select: {
        visit_id: true,
        patient_id: true,
        doctor_id: true,
        status: true,
      },
    });
  }

  create(data: Prisma.DentalHPIUncheckedCreateInput) {
    return prisma.dentalHPI.create({ data });
  }

  listByVisit(visitId: number) {
    return prisma.dentalHPI.findMany({
      where: { visit_id: visitId, status: 1 },
      orderBy: { createdAt: 'asc' },
    });
  }

  findById(hpiId: number) {
    return prisma.dentalHPI.findUnique({
      where: { hpi_id: hpiId },
    });
  }

  update(hpiId: number, data: Prisma.DentalHPIUncheckedUpdateInput) {
    return prisma.dentalHPI.update({
      where: { hpi_id: hpiId },
      data,
    });
  }

  delete(hpiId: number, userId?: string) {
    return prisma.dentalHPI.update({
      where: { hpi_id: hpiId },
      data: {
        status: 0,
        deletedAt: new Date(),
        deletedBy: userId ?? null,
      },
    });
  }
}
