import { prisma } from '../../../utils/prisma';
import { FamilyDisease, Prisma } from '@prisma/client';
import { CreateFamilyDiseaseDto, FamilyDiseaseFilters, UpdateFamilyDiseaseDto } from './familyDisease.types';

export class FamilyDiseaseRepository {
  async create(data: CreateFamilyDiseaseDto & { createdBy: string; updatedBy: string }): Promise<FamilyDisease> {
    return prisma.familyDisease.create({ data });
  }

  async findById(id: number): Promise<FamilyDisease | null> {
    return prisma.familyDisease.findUnique({ where: { family_disease_id: id } });
  }

  async findAll(filters: FamilyDiseaseFilters = {}): Promise<FamilyDisease[]> {
    const { search } = filters;
    const where: Prisma.FamilyDiseaseWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { diseaseName: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return prisma.familyDisease.findMany({ where, orderBy: { diseaseName: 'asc' } });
  }

  async update(id: number, data: UpdateFamilyDiseaseDto & { updatedBy: string }): Promise<FamilyDisease> {
    return prisma.familyDisease.update({ where: { family_disease_id: id }, data });
  }

  async softDelete(id: number, deletedBy: string): Promise<FamilyDisease> {
    return prisma.familyDisease.update({
      where: { family_disease_id: id },
      data: { status: 0, deletedAt: new Date(), deletedBy },
    });
  }
}
