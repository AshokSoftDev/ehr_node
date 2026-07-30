import { prisma } from '../../../utils/prisma';
import type { CreateSurgeryDto, UpdateSurgeryDto } from './surgery.types';

export class SurgeryRepository {
  async list(search?: string, status?: number) {
    const where: any = { deletedAt: null };
    if (status !== undefined) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { surgeryName: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }
    return prisma.surgeryMaster.findMany({
      where,
      orderBy: { surgeryName: 'asc' },
    });
  }

  async findById(id: number) {
    return prisma.surgeryMaster.findFirst({
      where: { surgery_id: id, deletedAt: null },
    });
  }

  async create(data: CreateSurgeryDto, userId?: string) {
    return prisma.surgeryMaster.create({
      data: {
        surgeryName: data.surgeryName,
        notes: data.notes || null,
        status: data.status ?? 1,
        createdBy: userId || null,
      },
    });
  }

  async update(id: number, data: UpdateSurgeryDto, userId?: string) {
    return prisma.surgeryMaster.update({
      where: { surgery_id: id },
      data: {
        ...data,
        updatedBy: userId || null,
      },
    });
  }

  async delete(id: number, userId?: string) {
    return prisma.surgeryMaster.update({
      where: { surgery_id: id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId || null,
        status: 0,
      },
    });
  }
}
