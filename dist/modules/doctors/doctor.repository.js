"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRepository = void 0;
const prisma_1 = require("../../utils/prisma");
class DoctorRepository {
    async create(data) {
        return prisma_1.prisma.doctor.create({
            data,
        });
    }
    async findById(id) {
        return prisma_1.prisma.doctor.findUnique({
            where: { id },
        });
    }
    async findByEmail(email) {
        return prisma_1.prisma.doctor.findUnique({
            where: { email },
        });
    }
    async findByLicenceNo(licenceNo) {
        return prisma_1.prisma.doctor.findUnique({
            where: { licenceNo },
        });
    }
    async update(id, data) {
        return prisma_1.prisma.doctor.update({
            where: { id },
            data,
        });
    }
    async softDelete(id, deletedBy) {
        return prisma_1.prisma.doctor.update({
            where: { id },
            data: {
                status: 0,
                deletedAt: new Date(),
                deletedBy,
            },
        });
    }
    async findAll(filters = {}, pagination = {}) {
        const { search, specialty, status = 1, email, licenceNo } = filters;
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;
        const where = {
            ...(search && {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { displayName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { licenceNo: { contains: search, mode: 'insensitive' } },
                ],
            }),
            ...(specialty && { specialty: { contains: specialty, mode: 'insensitive' } }),
            ...(status !== undefined && { status }),
            ...(email && { email: { contains: email, mode: 'insensitive' } }),
            ...(licenceNo && { licenceNo: { contains: licenceNo, mode: 'insensitive' } }),
        };
        const [doctors, total] = await Promise.all([
            prisma_1.prisma.doctor.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.doctor.count({ where }),
        ]);
        return {
            doctors,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findActive(pagination = {}) {
        return this.findAll({ status: 1 }, pagination);
    }
}
exports.DoctorRepository = DoctorRepository;
