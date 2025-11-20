import { AppError } from '../../../utils/errors';
import { LocationRepository } from './location.repository';
import { CreateLocationDto, LocationFilters, UpdateLocationDto } from './location.types';

export class LocationService {
  private repo = new LocationRepository();

  async list(filters: LocationFilters) {
    return this.repo.findAll(filters);
  }

  async create(dto: CreateLocationDto, userId: string) {
    return this.repo.create({ ...dto, createdBy: userId, updatedBy: userId });
  }

  async update(id: number, dto: UpdateLocationDto, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError('Location not found', 404);
    return this.repo.update(id, { ...dto, updatedBy: userId });
  }

  async remove(id: number, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError('Location not found', 404);
    return this.repo.softDelete(id, userId);
  }
}

