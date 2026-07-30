import { AppError } from '../../../utils/errors';
import { FamilyDiseaseRepository } from './familyDisease.repository';
import { FamilyDiseaseFilters, CreateFamilyDiseaseDto, UpdateFamilyDiseaseDto } from './familyDisease.types';

export class FamilyDiseaseService {
  private repo = new FamilyDiseaseRepository();

  async list(filters: FamilyDiseaseFilters) {
    return this.repo.findAll(filters);
  }

  async create(dto: CreateFamilyDiseaseDto, userId: string) {
    return this.repo.create({ ...dto, createdBy: userId, updatedBy: userId });
  }

  async get(id: number) {
    const item = await this.repo.findById(id);
    if (!item || item.deletedAt) throw new AppError('Family Disease not found', 404);
    return item;
  }

  async update(id: number, dto: UpdateFamilyDiseaseDto, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) throw new AppError('Family Disease not found', 404);
    return this.repo.update(id, { ...dto, updatedBy: userId });
  }

  async remove(id: number, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) throw new AppError('Family Disease not found', 404);
    return this.repo.softDelete(id, userId);
  }
}
