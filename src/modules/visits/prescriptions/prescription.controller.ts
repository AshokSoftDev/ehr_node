import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto, UpdatePrescriptionDto, BulkCreatePrescriptionDto, BulkUpdatePrescriptionDto, BulkDeletePrescriptionDto } from './prescription.types';

export class PrescriptionController {
  private service = new PrescriptionService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const visitId = Number(req.params.visitId);
    const data = await this.service.listByVisit(visitId);
    res.status(200).json({ status: 'success', data });
  });

  getOne = catchAsync(async (req: AuthRequest, res: Response) => {
    const visitId = Number(req.params.visitId);
    const prescriptionId = Number(req.params.prescriptionId);
    const data = await this.service.getOne(visitId, prescriptionId);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreatePrescriptionDto>, res: Response) => {
    const visitId = Number(req.params.visitId);
    const data = await this.service.create(visitId, req.body, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  // Bulk create multiple prescriptions
  bulkCreate = catchAsync(async (req: AuthRequest<BulkCreatePrescriptionDto>, res: Response) => {
    const visitId = Number(req.params.visitId);
    const data = await this.service.bulkCreate(visitId, req.body.prescriptions, req.user?.userId);
    res.status(201).json({ status: 'success', data, message: `Created ${data.length} prescriptions` });
  });

  // Bulk update multiple prescriptions
  bulkUpdate = catchAsync(async (req: AuthRequest<BulkUpdatePrescriptionDto>, res: Response) => {
    const visitId = Number(req.params.visitId);
    const data = await this.service.bulkUpdate(visitId, req.body.prescriptions, req.user?.userId);
    res.status(200).json({ status: 'success', data, message: `Updated ${data.length} prescriptions` });
  });

  // Bulk delete multiple prescriptions
  bulkDelete = catchAsync(async (req: AuthRequest<BulkDeletePrescriptionDto>, res: Response) => {
    const visitId = Number(req.params.visitId);
    const data = await this.service.bulkDelete(visitId, req.body.prescriptionIds, req.user?.userId);
    res.status(200).json({ status: 'success', data, message: `Deleted ${data.length} prescriptions` });
  });

  update = catchAsync(async (req: AuthRequest<UpdatePrescriptionDto>, res: Response) => {
    const visitId = Number(req.params.visitId);
    const prescriptionId = Number(req.params.prescriptionId);
    const data = await this.service.update(visitId, prescriptionId, req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const visitId = Number(req.params.visitId);
    const prescriptionId = Number(req.params.prescriptionId);
    const data = await this.service.remove(visitId, prescriptionId, req.user?.userId);
    res.status(200).json({ status: 'success', message: 'Prescription deleted', data });
  });
}
