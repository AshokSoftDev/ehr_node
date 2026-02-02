"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class DrugRepository {
    async create(data) {
        return prisma_1.prisma.drug.create({ data });
    }
    async findById(id) {
        return prisma_1.prisma.drug.findUnique({ where: { drug_id: id } });
    }
    async findAll(filters = {}) {
        const { search } = filters;
        const where = {
            status: 1,
            ...(search && {
                OR: [
                    { drug_generic: { contains: search, mode: 'insensitive' } },
                    { drug_name: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        return prisma_1.prisma.drug.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    async update(id, data) {
        return prisma_1.prisma.drug.update({ where: { drug_id: id }, data });
    }
    async softDelete(id, deletedBy) {
        return prisma_1.prisma.drug.update({
            where: { drug_id: id },
            data: { status: 0, deletedAt: new Date(), deletedBy },
        });
    }
}
exports.DrugRepository = DrugRepository;
