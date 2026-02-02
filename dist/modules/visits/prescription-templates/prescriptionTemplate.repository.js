"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionTemplateRepository = void 0;
const prisma_1 = require("../../../utils/prisma");
// Helper to convert BigInt to Number for JSON serialization
const serializeTemplate = (template) => ({
    ...template,
    template_id: Number(template.template_id),
});
class PrescriptionTemplateRepository {
    create(data) {
        return prisma_1.prisma.prescriptionTemplate.create({ data });
    }
    bulkCreate(data) {
        return prisma_1.prisma.prescriptionTemplate.createMany({ data });
    }
    async list(templateId, search) {
        const templates = await prisma_1.prisma.prescriptionTemplate.findMany({
            where: {
                status: 1,
                ...(templateId && { template_id: templateId }),
                ...(search && {
                    OR: [
                        { template_name: { contains: search, mode: 'insensitive' } },
                        { drug_name: { contains: search, mode: 'insensitive' } },
                    ],
                }),
            },
            orderBy: { createdAt: 'desc' },
        });
        // Convert BigInt to Number for JSON serialization
        return templates.map(serializeTemplate);
    }
    findById(tempId) {
        return prisma_1.prisma.prescriptionTemplate.findUnique({
            where: { temp_id: tempId },
        });
    }
    update(tempId, data) {
        return prisma_1.prisma.prescriptionTemplate.update({
            where: { temp_id: tempId },
            data,
        });
    }
}
exports.PrescriptionTemplateRepository = PrescriptionTemplateRepository;
