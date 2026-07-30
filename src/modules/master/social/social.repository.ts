import { prisma } from '../../../utils/prisma';
import { SocialMaster, Prisma } from '@prisma/client';
import { CreateSocialDto, SocialFilters, UpdateSocialDto } from './social.types';

export class SocialRepository {
  async create(data: CreateSocialDto & { createdBy: string; updatedBy: string }): Promise<SocialMaster> {
    return prisma.socialMaster.create({ data });
  }

  async findById(id: number): Promise<SocialMaster | null> {
    return prisma.socialMaster.findUnique({ where: { social_master_id: id } });
  }

  async findAll(filters: SocialFilters = {}): Promise<SocialMaster[]> {
    const { search } = filters;
    const where: Prisma.SocialMasterWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { socialName: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
          { option1: { contains: search, mode: 'insensitive' } },
          { option2: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return prisma.socialMaster.findMany({ where, orderBy: { socialName: 'asc' } });
  }

  async update(id: number, data: UpdateSocialDto & { updatedBy: string }): Promise<SocialMaster> {
    return prisma.socialMaster.update({ where: { social_master_id: id }, data });
  }

  async softDelete(id: number, deletedBy: string): Promise<SocialMaster> {
    return prisma.socialMaster.update({
      where: { social_master_id: id },
      data: { status: 0, deletedAt: new Date(), deletedBy },
    });
  }
}
