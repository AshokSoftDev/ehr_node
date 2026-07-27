import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { PatientPmhService } from './patientPmh.service';

export class PatientPmhController {
  private service = new PatientPmhService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const patientId = Number(req.params.patientId);
    const data = await this.service.list(patientId);
    res.status(200).json({ status: 'success', data });
  });

  sync = catchAsync(async (req: AuthRequest, res: Response) => {
    const patientId = Number(req.params.patientId);
    const data = await this.service.syncBulk(patientId, req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });
}
