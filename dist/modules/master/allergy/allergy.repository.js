"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergyRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class AllergyRepository {
    async create(data) {
        return prisma_1.prisma.allergy.create({ data });
    }
    async findById(id) {
        return prisma_1.prisma.allergy.findUnique({ where: { allergy_id: id } });
    }
    async findAll(filters = {}) {
        const { search } = filters;
        const where = {
            status: 1,
            ...(search && {
                OR: [
                    { allergyName: { contains: search, mode: 'insensitive' } },
                    { allergyType: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        return prisma_1.prisma.allergy.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    async update(id, data) {
        return prisma_1.prisma.allergy.update({ where: { allergy_id: id }, data });
    }
    async softDelete(id, deletedBy) {
        return prisma_1.prisma.allergy.update({
            where: { allergy_id: id },
            data: { status: 0, deletedAt: new Date(), deletedBy },
        });
    }
}
exports.AllergyRepository = AllergyRepository;
