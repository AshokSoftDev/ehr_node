import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { InsuranceService } from './insurance.service';
import { CreateInsuranceDto, InsuranceFilters, UpdateInsuranceDto } from './insurance.types';

export class InsuranceController {
  private service = new InsuranceService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const filters: InsuranceFilters = {
      search: req.query.search as string,
    };
    const data = await this.service.list(filters);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreateInsuranceDto>, res: Response) => {
    const data = await this.service.create(req.body, req.user?.userId || 'system');
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<UpdateInsuranceDto>, res: Response) => {
    const { id } = req.params;
    const data = await this.service.update(Number(id), req.body, req.user?.userId || 'system');
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = await this.service.remove(Number(id), req.user?.userId || 'system');
    res.status(200).json({ status: 'success', message: 'Insurance removed', data });
  });
}

