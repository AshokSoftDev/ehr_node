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
      doctor_id: q.doctor_id as string,
      patient: q.patient as string,
      patient_id: q.patient_id ? Number(q.patient_id) : undefined,
      reason: q.reason as string,
      search: q.search as string,
      status: q.status as string,
      page: q.page ? Number(q.page) : 1,
      limit: q.limit ? Number(q.limit) : 10,
    };
    const data = await this.service.list(filters);
    res.status(200).json({ status: 'success', data });
  });

  getStatusCounts = catchAsync(async (req: AuthRequest, res: Response) => {
    const q = req.query as any;
    const filters = {
      date: q.date ? new Date(String(q.date)) : undefined,
      doctorId: q.doctorId as string | undefined,
    };
    const data = await this.service.getStatusCounts(filters);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest, res: Response) => {
    const data = {
      ...req.body,
      createdBy: req.user?.userId,
      updatedBy: req.user?.userId,
    };
    const visit = await this.service.create(data);
    res.status(201).json({ status: 'success', data: visit });
  });
}

