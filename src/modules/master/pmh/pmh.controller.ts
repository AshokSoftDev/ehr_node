import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { PmhService } from './pmh.service';
import { PmhPayload, PmhUpdatePayload } from './pmh.types';

export class PmhController {
  private service = new PmhService();

  create = catchAsync(async (req: AuthRequest<PmhPayload>, res: Response) => {
    const data = await this.service.create(req.body, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const status = typeof req.query.status === 'string' ? Number(req.query.status) : undefined;
    
    const data = await this.service.list(search, status);
    res.status(200).json({ status: 'success', data });
  });

  get = catchAsync(async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const data = await this.service.getById(id);
    res.status(200).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<PmhUpdatePayload>, res: Response) => {
    const id = Number(req.params.id);
    const data = await this.service.update(id, req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const data = await this.service.remove(id, req.user?.userId);
    res.status(200).json({ status: 'success', message: 'PMH condition removed', data });
  });
}
