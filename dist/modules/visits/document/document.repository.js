"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class DocumentRepository {
    findVisitById(visitId) {
        return prisma_1.prisma.visit.findUnique({
            where: { visit_id: visitId },
            select: { visit_id: true, patient_id: true },
        });
    }
    create(data) {
        return prisma_1.prisma.visitDocument.create({ data });
    }
    listByVisit(visitId) {
        return prisma_1.prisma.visitDocument.findMany({
            where: { visit_id: visitId, status: 1 },
            include: {
                documentType: {
                    select: { document_type_id: true, type_name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    findById(documentId) {
        return prisma_1.prisma.visitDocument.findUnique({
            where: { document_id: documentId },
            include: {
                documentType: {
                    select: { document_type_id: true, type_name: true },
                },
            },
        });
    }
    update(documentId, data) {
        return prisma_1.prisma.visitDocument.update({
            where: { document_id: documentId },
            data,
        });
    }
    softDelete(documentId, deletedBy) {
        return prisma_1.prisma.visitDocument.update({
            where: { document_id: documentId },
            data: {
                status: 0,
                deletedAt: new Date(),
                deletedBy,
            },
        });
    }
}
exports.DocumentRepository = DocumentRepository;
