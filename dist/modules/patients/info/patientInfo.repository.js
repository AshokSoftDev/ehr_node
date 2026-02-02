"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientInfoRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class PatientInfoRepository {
    findPatient(patientId) {
        return prisma_1.prisma.patient.findUnique({
            where: { patient_id: patientId },
            select: { patient_id: true, activeStatus: true },
        });
    }
    getByPatientId(patientId) {
        return prisma_1.prisma.patientInfo.findUnique({
            where: { patient_id: patientId },
        });
    }
    create(data) {
        return prisma_1.prisma.patientInfo.create({ data });
    }
    update(patientId, data) {
        return prisma_1.prisma.patientInfo.update({
            where: { patient_id: patientId },
            data,
        });
    }
}
exports.PatientInfoRepository = PatientInfoRepository;
