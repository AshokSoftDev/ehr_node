import { AppError } from '../../../utils/errors';
import { PmhRepository } from './pmh.repository';
import { PmhPayload, PmhUpdatePayload } from './pmh.types';

export class PmhService {
  private repo = new PmhRepository();

  async create(payload: PmhPayload, userId?: string) {
    return this.repo.create({
      ...payload,
      status: payload.status ?? 1,
      createdBy: userId ?? null,
      updatedBy: userId ?? null,
    });
  }

  async list(search?: string, status?: number) {
    return this.repo.list(search, status);
  }

  async getById(id: number) {
    const pmh = await this.repo.findById(id);
    if (!pmh || pmh.deletedAt) {
      throw new AppError('PMH condition not found', 404);
    }
    return pmh;
  }

  async update(id: number, payload: PmhUpdatePayload, userId?: string) {
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) {
      throw new AppError('PMH condition not found', 404);
    }

    return this.repo.update(id, {
      ...payload,
      updatedBy: userId ?? null,
    });
  }

  async remove(id: number, userId?: string) {
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) {
      throw new AppError('PMH condition not found', 404);
    }

    return this.repo.update(id, {
      status: 0,
      deletedAt: new Date(),
      deletedBy: userId ?? null,
      updatedBy: userId ?? null,
    });
  }
}
