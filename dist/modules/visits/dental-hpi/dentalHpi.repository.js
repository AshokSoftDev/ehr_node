"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DentalHpiRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class DentalHpiRepository {
    findVisitById(visitId) {
        return prisma_1.prisma.visit.findUnique({
            where: { visit_id: visitId },
            select: {
                visit_id: true,
                patient_id: true,
                doctor_id: true,
                status: true,
            },
        });
    }
    create(data) {
        return prisma_1.prisma.dentalHPI.create({ data });
    }
    listByVisit(visitId) {
        return prisma_1.prisma.dentalHPI.findMany({
            where: { visit_id: visitId, status: 1 },
            orderBy: { createdAt: 'asc' },
        });
    }
    findById(hpiId) {
        return prisma_1.prisma.dentalHPI.findUnique({
            where: { hpi_id: hpiId },
        });
    }
    update(hpiId, data) {
        return prisma_1.prisma.dentalHPI.update({
            where: { hpi_id: hpiId },
            data,
        });
    }
    delete(hpiId, userId) {
        return prisma_1.prisma.dentalHPI.update({
            where: { hpi_id: hpiId },
            data: {
                status: 0,
                deletedAt: new Date(),
                deletedBy: userId ?? null,
            },
        });
    }
}
exports.DentalHpiRepository = DentalHpiRepository;
