"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRepository = void 0;
const prisma_1 = require("../../utils/prisma");
class PatientRepository {
    async findNextMrn() {
        const lastPatient = await prisma_1.prisma.patient.findFirst({
            orderBy: {
                patient_id: 'desc',
            },
        });
        let nextMrnNumber = 1001;
        if (lastPatient && lastPatient.mrn) {
            const lastMrnNumber = parseInt(lastPatient.mrn.replace('MRN', ''));
            nextMrnNumber = lastMrnNumber + 1;
        }
        return `MRN${nextMrnNumber}`;
    }
    async create(data) {
        const mrn = await this.findNextMrn();
        return prisma_1.prisma.patient.create({
            data: {
                ...data,
                mrn,
            },
        });
    }
    async findById(id) {
        return prisma_1.prisma.patient.findUnique({
            where: { patient_id: id, activeStatus: 1 },
        });
    }
    async update(id, data) {
        return prisma_1.prisma.patient.update({
            where: { patient_id: id },
            data,
        });
    }
    async softDelete(id, updatedBy) {
        return prisma_1.prisma.patient.update({
            where: { patient_id: id },
            data: {
                activeStatus: 0,
                updatedBy,
            },
        });
    }
    async findAll(filters = {}, pagination = {}) {
        const { search } = filters;
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;
        const where = {
            activeStatus: 1,
            ...(search && {
                OR: [
                    { mrn: { contains: search, mode: 'insensitive' } },
                    { mobileNumber: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [patients, total] = await Promise.all([
            prisma_1.prisma.patient.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.patient.count({ where }),
        ]);
        return {
            patients,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
}
exports.PatientRepository = PatientRepository;
