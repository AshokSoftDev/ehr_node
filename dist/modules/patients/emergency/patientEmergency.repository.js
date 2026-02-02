"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientEmergencyRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class PatientEmergencyRepository {
    findPatient(patientId) {
        return prisma_1.prisma.patient.findUnique({
            where: { patient_id: patientId },
            select: { patient_id: true, activeStatus: true },
        });
    }
    list(patientId) {
        return prisma_1.prisma.patientEmergency.findMany({
            where: { patient_id: patientId, status: 1 },
            orderBy: { createdAt: 'desc' },
        });
    }
    findById(peId) {
        return prisma_1.prisma.patientEmergency.findUnique({
            where: { pe_id: peId },
        });
    }
    create(data) {
        return prisma_1.prisma.patientEmergency.create({ data });
    }
    update(peId, data) {
        return prisma_1.prisma.patientEmergency.update({
            where: { pe_id: peId },
            data,
        });
    }
}
exports.PatientEmergencyRepository = PatientEmergencyRepository;
