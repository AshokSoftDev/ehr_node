import { prisma } from '../../../utils/prisma';
import { Insurance, Prisma } from '@prisma/client';
import { CreateInsuranceDto, InsuranceFilters, UpdateInsuranceDto } from './insurance.types';

export class InsuranceRepository {
  async create(data: CreateInsuranceDto & { createdBy: string; updatedBy: string }): Promise<Insurance> {
    return prisma.insurance.create({ data });
  }

  async findById(id: number): Promise<Insurance | null> {
    return prisma.insurance.findUnique({ where: { i_id: id } });
  }

  async findAll(filters: InsuranceFilters = {}): Promise<Insurance[]> {
    const { search } = filters;
    const where: Prisma.InsuranceWhereInput = {
      status: 1,
      ...(search && {
        OR: [
          { type: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { policy: { contains: search, mode: 'insensitive' } },
          { policyNo: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return prisma.insurance.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async update(id: number, data: UpdateInsuranceDto & { updatedBy: string }): Promise<Insurance> {
    return prisma.insurance.update({ where: { i_id: id }, data });
  }

  async softDelete(id: number, deletedBy: string): Promise<Insurance> {
    return prisma.insurance.update({
      where: { i_id: id },
      data: { status: 0, deletedAt: new Date(), deletedBy },
    });
  }
}

