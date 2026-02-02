"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalNoteRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class ClinicalNoteRepository {
    findVisitById(visitId) {
        return prisma_1.prisma.visit.findUnique({
            where: { visit_id: visitId },
            select: {
                visit_id: true,
                patient_id: true,
                appointment_id: true,
                location_id: true,
                doctor_id: true,
                status: true,
            },
        });
    }
    create(data) {
        return prisma_1.prisma.clinicalNotes.create({ data });
    }
    listByVisit(visitId) {
        return prisma_1.prisma.clinicalNotes.findMany({
            where: { visit_id: visitId, status: 1 },
            orderBy: { createdAt: 'desc' },
        });
    }
    findById(noteId) {
        return prisma_1.prisma.clinicalNotes.findUnique({
            where: { cn_id: noteId },
        });
    }
    update(noteId, data) {
        return prisma_1.prisma.clinicalNotes.update({
            where: { cn_id: noteId },
            data,
        });
    }
}
exports.ClinicalNoteRepository = ClinicalNoteRepository;
