"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class LocationRepository {
    async create(data) {
        return prisma_1.prisma.location.create({ data });
    }
    async findById(id) {
        return prisma_1.prisma.location.findUnique({ where: { location_id: id } });
    }
    async findAll(filters = {}) {
        const { search } = filters;
        const where = {
            status: 1, // return non-deleted locations (active can be true/false)
            ...(search && {
                OR: [
                    { location_name: { contains: search, mode: 'insensitive' } },
                    { city: { contains: search, mode: 'insensitive' } },
                    { state: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        return prisma_1.prisma.location.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    async update(id, data) {
        return prisma_1.prisma.location.update({ where: { location_id: id }, data });
    }
    async softDelete(id, deletedBy) {
        return prisma_1.prisma.location.update({
            where: { location_id: id },
            data: { status: 0, active: false, deletedAt: new Date(), deletedBy },
        });
    }
}
exports.LocationRepository = LocationRepository;
