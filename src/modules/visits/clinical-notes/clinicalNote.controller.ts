import { Response } from 'express';
import { catchAsync } from '../../../utils/errors';
import { AuthRequest } from '../../../types/express';
import { ClinicalNoteService } from './clinicalNote.service';
import { CreateClinicalNoteDto, UpdateClinicalNoteDto } from './clinicalNote.types';

export class ClinicalNoteController {
  private service = new ClinicalNoteService();

  list = catchAsync(async (req: AuthRequest, res: Response) => {
    const visitId = Number(req.params.visitId);
    const data = await this.service.listByVisit(visitId);
    res.status(200).json({ status: 'success', data });
  });

  getOne = catchAsync(async (req: AuthRequest, res: Response) => {
    const visitId = Number(req.params.visitId);
    const noteId = Number(req.params.noteId);
    const data = await this.service.getOne(visitId, noteId);
    res.status(200).json({ status: 'success', data });
  });

  create = catchAsync(async (req: AuthRequest<CreateClinicalNoteDto>, res: Response) => {
    const visitId = Number(req.params.visitId);
    const data = await this.service.create(visitId, req.body, req.file, req.user?.userId);
    res.status(201).json({ status: 'success', data });
  });

  update = catchAsync(async (req: AuthRequest<UpdateClinicalNoteDto>, res: Response) => {
    const visitId = Number(req.params.visitId);
    const noteId = Number(req.params.noteId);
    const data = await this.service.update(visitId, noteId, req.body, req.user?.userId);
    res.status(200).json({ status: 'success', data });
  });

  remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const visitId = Number(req.params.visitId);
    const noteId = Number(req.params.noteId);
    const data = await this.service.remove(visitId, noteId, req.user?.userId);
    res.status(200).json({ status: 'success', message: 'Clinical note deleted', data });
  });
}
