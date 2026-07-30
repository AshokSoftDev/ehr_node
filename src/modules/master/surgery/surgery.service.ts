import { SurgeryRepository } from './surgery.repository';
import type { CreateSurgeryDto, UpdateSurgeryDto } from './surgery.types';
import { AppError } from '../../../utils/errors';

export class SurgeryService {
  private repository: SurgeryRepository;

  constructor() {
    this.repository = new SurgeryRepository();
  }

  async list(search?: string, status?: number) {
    return this.repository.list(search, status);
  }

  async getById(id: number) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError('Surgery procedure not found', 404);
    }
    return item;
  }

  async create(data: CreateSurgeryDto, userId?: string) {
    return this.repository.create(data, userId);
  }

  async update(id: number, data: UpdateSurgeryDto, userId?: string) {
    await this.getById(id);
    return this.repository.update(id, data, userId);
  }

  async delete(id: number, userId?: string) {
    await this.getById(id);
    return this.repository.delete(id, userId);
  }
}
