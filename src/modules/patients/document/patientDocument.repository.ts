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

  listByPatient(patientId: number) {
    return prisma.visitDocument.findMany({
      where: { patient_id: patientId, status: 1 },
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
