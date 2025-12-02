import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { PatientAllergyService } from './patientAllergy.service';
import { PatientAllergyPayload, PatientAllergyUpdatePayload } from './patientAllergy.types';

export class PatientAllergyController {
  private service = new PatientAllergyService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const patientId = Number(req.params.patientId);
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const data = await this.service.list(patientId, search);
    res.status(200).json({ status: 'success', data });
  });

  get = catchAsync(async (req: AuthRequest, res: Response) => {
    const patientId = Number(req.params.patientId);
    const paId = Number(req.params.paId);
    const data = await this.service.get(patientId, paId);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<PatientAllergyPayload>, res: Response) => {
    const patientId = Number(req.params.patientId);
    const data = await this.service.create(patientId, req.body, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<PatientAllergyUpdatePayload>, res: Response) => {
    const patientId = Number(req.params.patientId);
    const paId = Number(req.params.paId);
    const data = await this.service.update(patientId, paId, req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const patientId = Number(req.params.patientId);
    const paId = Number(req.params.paId);
    const data = await this.service.remove(patientId, paId, req.user?.userId);
    res.status(200).json({ status: 'success', message: 'Patient allergy removed', data });
  });
}
