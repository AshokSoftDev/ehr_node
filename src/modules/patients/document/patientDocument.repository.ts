import { Prisma, VisitDocument } from '@prisma/client';
import { prisma } from '../../../utils/prisma';

export class PatientDocumentRepository {
  findPatientById(patientId: number) {
    return prisma.patient.findUnique({
      where: { patient_id: patientId },
      select: { patient_id: true },
    });
  }

  create(data: Prisma.VisitDocumentUncheckedCreateInput): Promise<VisitDocument> {
    return prisma.visitDocument.create({ data });
  }

  listByPatient(patientId: number, filters?: { search?: string; dateFrom?: string; dateTo?: string }) {
    const where: any = {
      patient_id: patientId,
      status: 1,
    };

    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        const dFrom = new Date(filters.dateFrom);
        dFrom.setHours(0, 0, 0, 0);
        where.createdAt.gte = dFrom;
      }
      if (filters.dateTo) {
        const dTo = new Date(filters.dateTo);
        dTo.setHours(23, 59, 59, 999);
        where.createdAt.lte = dTo;
      }
    }

    if (filters?.search) {
      const search = filters.search;
      where.OR = [
        { file_name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { documentType: { type_name: { contains: search, mode: 'insensitive' } } },
        { visit: { doctor: { displayName: { contains: search, mode: 'insensitive' } } } },
        { visit: { visit_type: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return prisma.visitDocument.findMany({
      where,
      include: {
        documentType: {
          select: { document_type_id: true, type_name: true },
        },
        visit: {
          select: {
            visit_id: true,
            visit_type: true,
            visit_date: true,
            doctor: { select: { displayName: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(documentId: number) {
    return prisma.visitDocument.findUnique({
      where: { document_id: documentId },
      include: {
        documentType: {
          select: { document_type_id: true, type_name: true },
        },
      },
    });
  }

  update(documentId: number, data: Prisma.VisitDocumentUncheckedUpdateInput): Promise<VisitDocument> {
    return prisma.visitDocument.update({
      where: { document_id: documentId },
      data,
    });
  }

  softDelete(documentId: number, deletedBy?: string): Promise<VisitDocument> {
    return prisma.visitDocument.update({
      where: { document_id: documentId },
      data: {
        status: 0,
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }
}
