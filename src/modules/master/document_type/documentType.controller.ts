import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { DocumentTypeService } from './documentType.service';
import { CreateDocumentTypeDto, UpdateDocumentTypeDto } from './documentType.types';

const service = new DocumentTypeService();

export class DocumentTypeController {
  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const filters = req.query;
    const documentTypes = await service.list(filters);
    res.json({ status: 'success', data: documentTypes });
  });

  getOne = catchAsync(async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const documentType = await service.getOne(id);
    if (!documentType) {
      return res.status(404).json({ status: 'error', message: 'Document type not found' });
    }
    res.json({ status: 'success', data: documentType });
  });

  create = catchAsync(async (req: AuthRequest<CreateDocumentTypeDto>, res: Response) => {
    const documentType = await service.create(req.body, req.user?.userId);
    res.status(201).json({ status: 'success', data: documentType });
  });

  update = catchAsync(async (req: AuthRequest<UpdateDocumentTypeDto>, res: Response) => {
    const id = Number(req.params.id);
    const documentType = await service.update(id, req.body, req.user?.userId);
    res.json({ status: 'success', data: documentType });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    await service.remove(id, req.user?.userId);
    res.json({ status: 'success', message: 'Document type deleted' });
  });
}
