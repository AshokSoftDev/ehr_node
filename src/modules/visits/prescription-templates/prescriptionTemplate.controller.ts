import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { PrescriptionTemplateService } from './prescriptionTemplate.service';
import { CreatePrescriptionTemplateDto, UpdatePrescriptionTemplateDto, BulkCreatePrescriptionTemplateDto } from './prescriptionTemplate.types';

export class PrescriptionTemplateController {
  private service = new PrescriptionTemplateService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const templateId = req.query.template_id ? Number(req.query.template_id) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const data = await this.service.list(templateId, search);
    res.status(200).json({ status: 'success', data });
  });

  getOne = catchAsync(async (req: AuthRequest, res: Response) => {
    const tempId = Number(req.params.tempId);
    const data = await this.service.getOne(tempId);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreatePrescriptionTemplateDto>, res: Response) => {
    const data = await this.service.create(req.body, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  bulkCreate = catchAsync(async (req: AuthRequest<BulkCreatePrescriptionTemplateDto>, res: Response) => {
    const data = await this.service.bulkCreate(req.body.templates, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<UpdatePrescriptionTemplateDto>, res: Response) => {
    const tempId = Number(req.params.tempId);
    const data = await this.service.update(tempId, req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const tempId = Number(req.params.tempId);
    const data = await this.service.remove(tempId, req.user?.userId);
    res.status(200).json({ status: 'success', message: 'Prescription template deleted', data });
  });
}
