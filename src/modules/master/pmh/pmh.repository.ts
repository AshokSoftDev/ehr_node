import { Prisma } from '@prisma/client';
import { PmhPayload, PmhUpdatePayload } from './pmh.types';
import { prisma } from '../../../utils/prisma';

export class PmhRepository {
  async create(data: PmhPayload & { createdBy: string | null; updatedBy: string | null }) {
    return prisma.pmh.create({
      data,
    });
  }

  async findById(id: number) {
    return prisma.pmh.findUnique({
      where: { pmh_id: id },
    });
  }

  async list(search?: string, status?: number) {
    const where: Prisma.PmhWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { conditionName: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status !== undefined) {
      where.status = status;
    }

    return prisma.pmh.findMany({
      where,
      orderBy: { conditionName: 'asc' },
    });
  }

  async update(id: number, data: PmhUpdatePayload & { updatedBy: string | null; deletedAt?: Date | null; deletedBy?: string | null }) {
    return prisma.pmh.update({
      where: { pmh_id: id },
      data,
    });
  }
}
