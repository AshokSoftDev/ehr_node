import { Response } from 'express';
import { catchAsync } from '../../utils/errors';
import { AuthRequest } from '../../types/express';
import { VisitService } from './visit.service';
import { VisitFilters } from './visit.types';

export class VisitController {
  private service = new VisitService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const q = req.query as any;
    const filters: VisitFilters = {
      dateFrom: q.dateFrom ? new Date(String(q.dateFrom)) : undefined,
      dateTo: q.dateTo ? new Date(String(q.dateTo)) : undefined,
      doctor: q.doctor as string,
      patient: q.patient as string,
      reason: q.reason as string,
      status: q.status as string,
      page: q.page ? Number(q.page) : 1,
      limit: q.limit ? Number(q.limit) : 10,
    };
    const data = await this.service.list(filters);
    res.status(200).json({ status: 'success', data });
  });
}

