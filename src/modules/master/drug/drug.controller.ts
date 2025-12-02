import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { DrugService } from './drug.service';
import { CreateDrugDto, DrugFilters, UpdateDrugDto } from './drug.types';

export class DrugController {
  private service = new DrugService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const filters: DrugFilters = {
      search: req.query.search as string,
    };
    const data = await this.service.list(filters);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreateDrugDto>, res: Response) => {
    const data = await this.service.create(req.body, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<UpdateDrugDto>, res: Response) => {
    const { id } = req.params;
    const data = await this.service.update(Number(id), req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = await this.service.remove(Number(id), req.user?.userId);
    res.status(200).json({ status: 'success', message: 'Drug removed', data });
  });
}

