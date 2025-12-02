import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { PatientEmergencyService } from './patientEmergency.service';
import { PatientEmergencyPayload, PatientEmergencyUpdatePayload } from './patientEmergency.types';

export class PatientEmergencyController {
  private service = new PatientEmergencyService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const patientId = Number(req.params.patientId);
    const data = await this.service.list(patientId);
    res.status(200).json({ status: 'success', data });
  });

  get = catchAsync(async (req: AuthRequest, res: Response) => {
    const patientId = Number(req.params.patientId);
    const peId = Number(req.params.peId);
    const data = await this.service.get(patientId, peId);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<PatientEmergencyPayload>, res: Response) => {
    const patientId = Number(req.params.patientId);
    const data = await this.service.create(patientId, req.body, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<PatientEmergencyUpdatePayload>, res: Response) => {
    const patientId = Number(req.params.patientId);
    const peId = Number(req.params.peId);
    const data = await this.service.update(patientId, peId, req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const patientId = Number(req.params.patientId);
    const peId = Number(req.params.peId);
    const data = await this.service.remove(patientId, peId, req.user?.userId);
    res.status(200).json({ status: 'success', message: 'Emergency contact removed', data });
  });
}
