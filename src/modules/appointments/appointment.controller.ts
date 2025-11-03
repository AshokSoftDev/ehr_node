import { Response } from 'express';
import { catchAsync } from '../../utils/errors';
import { AuthRequest } from '../../types/express';
import { AppointmentService } from './appointment.service';
import { AppointmentFilters, CreateAppointmentDto, UpdateAppointmentDto } from './appointment.types';

export class AppointmentController {
  private service = new AppointmentService();

  searchMrn = catchAsync(async (req: AuthRequest, res: Response) => {
    const { search } = req.query as any;
    const data = await this.service.searchMrn(String(search));
    res.status(200).json({ status: 'success', data });
  });

  doctors = catchAsync(async (_req: AuthRequest, res: Response) => {
    const data = await this.service.getDoctors();
    res.status(200).json({ status: 'success', data });
  });

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const q = req.query as any;
    const filters: AppointmentFilters = {
      search: q.search as string,
      mrn: q.mrn as string,
      patientName: q.patientName as string,
      doctorName: q.doctorName as string,
      dateFrom: q.dateFrom ? new Date(String(q.dateFrom)) : undefined,
      dateTo: q.dateTo ? new Date(String(q.dateTo)) : undefined,
      page: q.page ? Number(q.page) : 1,
      limit: q.limit ? Number(q.limit) : 10,
    };
    const data = await this.service.list(filters);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreateAppointmentDto>, res: Response) => {
    const data = await this.service.create(req.body, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<UpdateAppointmentDto>, res: Response) => {
    const { id } = req.params;
    const data = await this.service.update(Number(id), req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = await this.service.remove(Number(id), req.user?.userId);
    res.status(200).json({ status: 'success', message: 'Appointment deleted', data });
  });
}
