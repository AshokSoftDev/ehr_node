"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientAllergyRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class PatientAllergyRepository {
    findPatient(patientId) {
        return prisma_1.prisma.patient.findUnique({
            where: { patient_id: patientId },
            select: { patient_id: true, activeStatus: true },
        });
    }
    list(patientId, search) {
        return prisma_1.prisma.patientAllergy.findMany({
            where: {
                patient_id: patientId,
                status: 1,
                ...(search
                    ? {
                        allergyName: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    }
                    : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    findById(paId) {
        return prisma_1.prisma.patientAllergy.findUnique({
            where: { id: paId },
        });
    }
    create(data) {
        return prisma_1.prisma.patientAllergy.create({ data });
    }
    update(paId, data) {
        return prisma_1.prisma.patientAllergy.update({
            where: { id: paId },
            data,
        });
    }
}
exports.PatientAllergyRepository = PatientAllergyRepository;
