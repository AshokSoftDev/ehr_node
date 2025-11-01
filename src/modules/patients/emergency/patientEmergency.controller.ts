import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { PatientEmergencyService } from './patientEmergency.service';
import { CreatePatientEmergencyDto, UpdatePatientEmergencyDto } from './patientEmergency.types';

export class PatientEmergencyController {
  private service = new PatientEmergencyService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = await this.service.list(Number(id));
    res.status(200).json({ status: 'success', data });
  });

  get = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id, peId } = req.params;
    const data = await this.service.get(Number(id), Number(peId));
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreatePatientEmergencyDto>, res: Response) => {
    const { id } = req.params;
    const data = await this.service.create(Number(id), req.body, req.user?.userId || 'system');
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<UpdatePatientEmergencyDto>, res: Response) => {
    const { id, peId } = req.params;
    const data = await this.service.update(Number(id), Number(peId), req.body, req.user?.userId || 'system');
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id, peId } = req.params;
    const data = await this.service.remove(Number(id), Number(peId), req.user?.userId || 'system');
    res.status(200).json({ status: 'success', message: 'Emergency contact removed', data });
  });
}
