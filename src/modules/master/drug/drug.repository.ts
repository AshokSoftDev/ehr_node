import { prisma } from '../../../utils/prisma';
import type { Prisma } from '@prisma/client';
import type { CreateDrugDto, DrugFilters, UpdateDrugDto } from './drug.types';

export class DrugRepository {
  async create(data: CreateDrugDto & { createdBy?: string; updatedBy?: string }) {
    return prisma.drug.create({ data });
  }

  async findById(id: number) {
    return prisma.drug.findUnique({ where: { drug_id: id } });
  }

  async findAll(filters: DrugFilters = {}) {
    const { search } = filters;
    const where: Prisma.DrugWhereInput = {
      status: 1,
      ...(search && {
        OR: [
          { drug_generic: { contains: search, mode: 'insensitive' } },
          { drug_name: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return prisma.drug.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async update(id: number, data: UpdateDrugDto & { updatedBy?: string }) {
    return prisma.drug.update({ where: { drug_id: id }, data });
  }

  async softDelete(id: number, deletedBy?: string) {
    return prisma.drug.update({
      where: { drug_id: id },
      data: { status: 0, deletedAt: new Date(), deletedBy },
    });
  }
}
