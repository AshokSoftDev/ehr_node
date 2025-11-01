import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { PatientAllergyService } from './patientAllergy.service';
import { CreatePatientAllergyDto, UpdatePatientAllergyDto } from './patientAllergy.types';

export class PatientAllergyController {
  private service = new PatientAllergyService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const search = (req.query?.search as string) || undefined;
    const data = await this.service.list(Number(id), search);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreatePatientAllergyDto>, res: Response) => {
    const { id } = req.params;
    const data = await this.service.create(Number(id), req.body, req.user?.userId || 'system');
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<UpdatePatientAllergyDto>, res: Response) => {
    const { id, paId } = req.params;
    const data = await this.service.update(Number(id), Number(paId), req.body, req.user?.userId || 'system');
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id, paId } = req.params;
    const data = await this.service.remove(Number(id), Number(paId), req.user?.userId || 'system');
    res.status(200).json({ status: 'success', message: 'Patient allergy removed', data });
  });
}

