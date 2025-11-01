import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { PatientInfoService } from './patientInfo.service';
import { CreatePatientInfoDto, UpdatePatientInfoDto } from './patientInfo.types';

export class PatientInfoController {
  private service = new PatientInfoService();

  get = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const info = await this.service.get(Number(id));
    res.status(200).json({ status: 'success', data: info });
  });

  create = catchAsync(async (req: AuthRequest<CreatePatientInfoDto>, res: Response) => {
    const { id } = req.params;
    const info = await this.service.create(Number(id), req.body, req.user?.userId || 'system');
    res.status(201).json({ status: 'success', data: info });
  });

  upsert = catchAsync(async (req: AuthRequest<CreatePatientInfoDto | UpdatePatientInfoDto>, res: Response) => {
    const { id } = req.params;
    const info = await this.service.upsert(Number(id), req.body, req.user?.userId || 'system');
    res.status(200).json({ status: 'success', data: info });
  });

  update = catchAsync(async (req: AuthRequest<UpdatePatientInfoDto>, res: Response) => {
    const { id } = req.params;
    const info = await this.service.update(Number(id), req.body, req.user?.userId || 'system');
    res.status(200).json({ status: 'success', data: info });
  });
}
