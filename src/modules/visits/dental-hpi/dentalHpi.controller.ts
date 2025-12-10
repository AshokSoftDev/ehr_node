import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { DentalHpiService } from './dentalHpi.service';
import { CreateDentalHPIDto, UpdateDentalHPIDto } from './dentalHpi.types';

export class DentalHpiController {
  private service = new DentalHpiService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const visitId = Number(req.params.visitId);
    const data = await this.service.listByVisit(visitId);
    res.status(200).json({ status: 'success', data });
  });

  getOne = catchAsync(async (req: AuthRequest, res: Response) => {
    const visitId = Number(req.params.visitId);
    const hpiId = Number(req.params.hpiId);
    const data = await this.service.getOne(visitId, hpiId);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreateDentalHPIDto>, res: Response) => {
    const visitId = Number(req.params.visitId);
    const data = await this.service.create(visitId, req.body, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<UpdateDentalHPIDto>, res: Response) => {
    const visitId = Number(req.params.visitId);
    const hpiId = Number(req.params.hpiId);
    const data = await this.service.update(visitId, hpiId, req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const visitId = Number(req.params.visitId);
    const hpiId = Number(req.params.hpiId);
    const data = await this.service.remove(visitId, hpiId, req.user?.userId);
    res.status(200).json({ status: 'success', message: 'Dental HPI entry deleted', data });
  });
}
