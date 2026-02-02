"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypeRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
class DocumentTypeRepository {
    create(data) {
        return prisma_1.prisma.documentType.create({ data });
    }
    findAll(filters) {
        const where = {
            status: filters?.status ?? 1,
        };
        if (filters?.search) {
            where.OR = [
                { type_name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return prisma_1.prisma.documentType.findMany({
            where,
            orderBy: { type_name: 'asc' },
        });
    }
    findById(id) {
        return prisma_1.prisma.documentType.findUnique({
            where: { document_type_id: id },
        });
    }
    update(id, data) {
        return prisma_1.prisma.documentType.update({
            where: { document_type_id: id },
            data,
        });
    }
    softDelete(id, deletedBy) {
        return prisma_1.prisma.documentType.update({
            where: { document_type_id: id },
            data: {
                status: 0,
                deletedAt: new Date(),
                deletedBy,
            },
        });
    }
}
exports.DocumentTypeRepository = DocumentTypeRepository;
