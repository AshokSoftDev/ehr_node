import { prisma } from '../../../utils/prisma';
import { Allergy, Prisma } from '@prisma/client';
import { CreateAllergyDto, AllergyFilters, UpdateAllergyDto } from './allergy.types';

export class AllergyRepository {
  async create(data: CreateAllergyDto & { createdBy: string; updatedBy: string }): Promise<Allergy> {
    return prisma.allergy.create({ data });
  }

  async findById(id: number): Promise<Allergy | null> {
    return prisma.allergy.findUnique({ where: { allergy_id: id } });
  }

  async findAll(filters: AllergyFilters = {}): Promise<Allergy[]> {
    const { search } = filters;
    const where: Prisma.AllergyWhereInput = {
      status: 1,
      ...(search && {
        OR: [
          { allergyName: { contains: search, mode: 'insensitive' } },
          { allergyType: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return prisma.allergy.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async update(id: number, data: UpdateAllergyDto & { updatedBy: string }): Promise<Allergy> {
    return prisma.allergy.update({ where: { allergy_id: id }, data });
  }

  async softDelete(id: number, deletedBy: string): Promise<Allergy> {
    return prisma.allergy.update({
      where: { allergy_id: id },
      data: { status: 0, deletedAt: new Date(), deletedBy },
    });
  }
}

