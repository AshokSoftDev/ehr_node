import { Prisma, VisitDocument } from '@prisma/client';
import { prisma } from '../../../utils/prisma';

export class DocumentRepository {
  findVisitById(visitId: number) {
    return prisma.visit.findUnique({
      where: { visit_id: visitId },
      select: { visit_id: true, patient_id: true },
    });
  }

  create(data: Prisma.VisitDocumentUncheckedCreateInput): Promise<VisitDocument> {
    return prisma.visitDocument.create({ data });
  }

  listByVisit(visitId: number) {
    return prisma.visitDocument.findMany({
      where: { visit_id: visitId, status: 1 },
      include: {
        documentType: {
          select: { document_type_id: true, type_name: true },
        },
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
