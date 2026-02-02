"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class InsuranceRepository {
    async create(data) {
        return prisma_1.prisma.insurance.create({ data });
    }
    async findById(id) {
        return prisma_1.prisma.insurance.findUnique({ where: { i_id: id } });
    }
    async findAll(filters = {}) {
        const { search } = filters;
        const where = {
            status: 1,
            ...(search && {
                OR: [
                    { type: { contains: search, mode: 'insensitive' } },
                    { company: { contains: search, mode: 'insensitive' } },
                    { policy: { contains: search, mode: 'insensitive' } },
                    { policyNo: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        return prisma_1.prisma.insurance.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    async update(id, data) {
        return prisma_1.prisma.insurance.update({ where: { i_id: id }, data });
    }
    async softDelete(id, deletedBy) {
        return prisma_1.prisma.insurance.update({
            where: { i_id: id },
            data: { status: 0, deletedAt: new Date(), deletedBy },
        });
    }
}
exports.InsuranceRepository = InsuranceRepository;
