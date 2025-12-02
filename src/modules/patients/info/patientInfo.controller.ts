import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { PatientInfoService } from './patientInfo.service';
import { PatientInfoPayload, PatientInfoUpdatePayload } from './patientInfo.types';

export class PatientInfoController {
  private service = new PatientInfoService();

  get = catchAsync(async (req: AuthRequest, res: Response) => {
    const patientId = Number(req.params.patientId);
    const data = await this.service.get(patientId);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<PatientInfoPayload>, res: Response) => {
    const patientId = Number(req.params.patientId);
    const data = await this.service.create(patientId, req.body, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<PatientInfoUpdatePayload>, res: Response) => {
    const patientId = Number(req.params.patientId);
    const data = await this.service.update(patientId, req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });
}
