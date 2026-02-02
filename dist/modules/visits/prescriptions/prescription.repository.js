"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class PrescriptionRepository {
    findVisitById(visitId) {
        return prisma_1.prisma.visit.findUnique({
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
    create(data) {
        return prisma_1.prisma.prescription.create({ data });
    }
    listByVisit(visitId) {
        return prisma_1.prisma.prescription.findMany({
            where: { visit_id: visitId, status: 1 },
            orderBy: { createdAt: 'asc' },
        });
    }
    findById(prescriptionId) {
        return prisma_1.prisma.prescription.findUnique({
            where: { prescription_id: prescriptionId },
        });
    }
    update(prescriptionId, data) {
        return prisma_1.prisma.prescription.update({
            where: { prescription_id: prescriptionId },
            data,
        });
    }
}
exports.PrescriptionRepository = PrescriptionRepository;
