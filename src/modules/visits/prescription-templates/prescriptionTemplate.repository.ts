import { Prisma, PrescriptionTemplate } from '@prisma/client';
import { prisma } from '../../../utils/prisma';

// Helper to convert BigInt to Number for JSON serialization
const serializeTemplate = (template: PrescriptionTemplate) => ({
  ...template,
  template_id: Number(template.template_id),
});

export class PrescriptionTemplateRepository {
  create(data: Prisma.PrescriptionTemplateUncheckedCreateInput): Promise<PrescriptionTemplate> {
    return prisma.prescriptionTemplate.create({ data });
  }

  bulkCreate(data: Prisma.PrescriptionTemplateUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
    return prisma.prescriptionTemplate.createMany({ data });
  }

  async list(templateId?: number, search?: string): Promise<ReturnType<typeof serializeTemplate>[]> {
    const templates = await prisma.prescriptionTemplate.findMany({
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

  findById(tempId: number): Promise<PrescriptionTemplate | null> {
    return prisma.prescriptionTemplate.findUnique({
      where: { temp_id: tempId },
    });
  }

  update(tempId: number, data: Prisma.PrescriptionTemplateUncheckedUpdateInput): Promise<PrescriptionTemplate> {
    return prisma.prescriptionTemplate.update({
      where: { temp_id: tempId },
      data,
    });
  }
}
