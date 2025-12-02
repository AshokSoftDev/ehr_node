import { AppError } from '../../../utils/errors';
import { DrugRepository } from './drug.repository';
import { CreateDrugDto, DrugFilters, UpdateDrugDto } from './drug.types';

export class DrugService {
  private repo = new DrugRepository();

  async list(filters: DrugFilters) {
    return this.repo.findAll(filters);
  }

  async create(dto: CreateDrugDto, userId?: string) {
    return this.repo.create({ ...dto, createdBy: userId, updatedBy: userId });
  }

  async update(id: number, dto: UpdateDrugDto, userId?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError('Drug not found', 404);
    return this.repo.update(id, { ...dto, updatedBy: userId });
  }

  async remove(id: number, userId?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError('Drug not found', 404);
    return this.repo.softDelete(id, userId);
  }
}

