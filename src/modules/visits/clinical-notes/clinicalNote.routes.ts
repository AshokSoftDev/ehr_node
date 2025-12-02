import { Router } from 'express';
import multer from 'multer';
import { validate } from '../../../middleware/validate.middleware';
import { ClinicalNoteController } from './clinicalNote.controller';
import {
  clinicalNoteParamsSchema,
  createClinicalNoteSchema,
  listClinicalNotesSchema,
  updateClinicalNoteSchema,
} from './clinicalNote.schema';

const router = Router({ mergeParams: true });
const controller = new ClinicalNoteController();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', validate(listClinicalNotesSchema), controller.list);
router.get('/:noteId', validate(clinicalNoteParamsSchema), controller.getOne);
router.post('/', upload.single('audio'), validate(createClinicalNoteSchema), controller.create);
router.put('/:noteId', validate(updateClinicalNoteSchema), controller.update);
router.delete('/:noteId', validate(clinicalNoteParamsSchema), controller.remove);

export default router;
