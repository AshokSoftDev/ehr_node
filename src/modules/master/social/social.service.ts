import { AppError } from '../../../utils/errors';
import { SocialRepository } from './social.repository';
import { SocialFilters, CreateSocialDto, UpdateSocialDto } from './social.types';

export class SocialService {
  private repo = new SocialRepository();

  async list(filters: SocialFilters) {
    return this.repo.findAll(filters);
  }

  async create(dto: CreateSocialDto, userId: string) {
    return this.repo.create({ ...dto, createdBy: userId, updatedBy: userId });
  }

  async get(id: number) {
    const item = await this.repo.findById(id);
    if (!item || item.deletedAt) throw new AppError('Social history item not found', 404);
    return item;
  }

  async update(id: number, dto: UpdateSocialDto, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) throw new AppError('Social history item not found', 404);
    return this.repo.update(id, { ...dto, updatedBy: userId });
  }

  async remove(id: number, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) throw new AppError('Social history item not found', 404);
    return this.repo.softDelete(id, userId);
  }
}
