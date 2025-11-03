import { AppError } from '../../../utils/errors';
import { AllergyRepository } from './allergy.repository';
import { AllergyFilters, CreateAllergyDto, UpdateAllergyDto } from './allergy.types';

export class AllergyService {
  private repo = new AllergyRepository();

  async list(filters: AllergyFilters) {
    return this.repo.findAll(filters);
  }

  async create(dto: CreateAllergyDto, userId: string) {
    return this.repo.create({ ...dto, createdBy: userId, updatedBy: userId });
  }

  async update(id: number, dto: UpdateAllergyDto, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError('Allergy not found', 404);
    return this.repo.update(id, { ...dto, updatedBy: userId });
  }

  async remove(id: number, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError('Allergy not found', 404);
    return this.repo.softDelete(id, userId);
  }
}

