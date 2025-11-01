import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { AllergyService } from './allergy.service';
import { CreateAllergyDto, AllergyFilters, UpdateAllergyDto } from './allergy.types';

export class AllergyController {
  private service = new AllergyService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const filters: AllergyFilters = {
      search: req.query.search as string,
    };
    const data = await this.service.list(filters);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreateAllergyDto>, res: Response) => {
    const data = await this.service.create(req.body, req.user?.userId || 'system');
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<UpdateAllergyDto>, res: Response) => {
    const { id } = req.params;
    const data = await this.service.update(Number(id), req.body, req.user?.userId || 'system');
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = await this.service.remove(Number(id), req.user?.userId || 'system');
    res.status(200).json({ status: 'success', message: 'Allergy removed', data });
  });
}

