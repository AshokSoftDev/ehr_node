import { prisma } from '../../../utils/prisma';
import { Location, Prisma } from '@prisma/client';
import { CreateLocationDto, LocationFilters, UpdateLocationDto } from './location.types';

export class LocationRepository {
  async create(data: CreateLocationDto & { createdBy: string; updatedBy: string }): Promise<Location> {
    return prisma.location.create({ data });
  }

  async findById(id: number): Promise<Location | null> {
    return prisma.location.findUnique({ where: { location_id: id } });
  }

  async findAll(filters: LocationFilters = {}): Promise<Location[]> {
    const { search } = filters;
    const where: Prisma.LocationWhereInput = {
      status: 1,
      ...(search && {
        OR: [
          { location_name: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { state: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return prisma.location.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async update(id: number, data: UpdateLocationDto & { updatedBy: string }): Promise<Location> {
    return prisma.location.update({ where: { location_id: id }, data });
  }

  async softDelete(id: number, deletedBy: string): Promise<Location> {
    return prisma.location.update({
      where: { location_id: id },
      data: { status: 0, deletedAt: new Date(), deletedBy },
    });
  }
}

