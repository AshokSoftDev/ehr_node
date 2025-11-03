import { AppError } from '../../../utils/errors';
import { InsuranceRepository } from './insurance.repository';
import { CreateInsuranceDto, InsuranceFilters, UpdateInsuranceDto } from './insurance.types';

export class InsuranceService {
  private repo = new InsuranceRepository();

  async list(filters: InsuranceFilters) {
    return this.repo.findAll(filters);
  }

  async create(dto: CreateInsuranceDto, userId: string) {
    return this.repo.create({ ...dto, createdBy: userId, updatedBy: userId });
  }

  async update(id: number, dto: UpdateInsuranceDto, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError('Insurance not found', 404);
    return this.repo.update(id, { ...dto, updatedBy: userId });
  }

  async remove(id: number, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError('Insurance not found', 404);
    return this.repo.softDelete(id, userId);
  }
}

