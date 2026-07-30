import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { FamilyDiseaseService } from './familyDisease.service';
import { CreateFamilyDiseaseDto, FamilyDiseaseFilters, UpdateFamilyDiseaseDto } from './familyDisease.types';

export class FamilyDiseaseController {
  private service = new FamilyDiseaseService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const filters: FamilyDiseaseFilters = {
      search: req.query.search as string,
    };
    const data = await this.service.list(filters);
    res.status(200).json({ status: 'success', data });
  });

  get = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = await this.service.get(Number(id));
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreateFamilyDiseaseDto>, res: Response) => {
    const data = await this.service.create(req.body, req.user?.userId || 'system');
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<UpdateFamilyDiseaseDto>, res: Response) => {
    const { id } = req.params;
    const data = await this.service.update(Number(id), req.body, req.user?.userId || 'system');
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = await this.service.remove(Number(id), req.user?.userId || 'system');
    res.status(200).json({ status: 'success', message: 'Family Disease removed', data });
  });
}
