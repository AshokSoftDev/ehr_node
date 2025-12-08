import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { DocumentTypeController } from './documentType.controller';
import {
  createDocumentTypeSchema,
  updateDocumentTypeSchema,
  documentTypeIdSchema,
  listDocumentTypesSchema,
} from './documentType.schema';

const router = Router();
const controller = new DocumentTypeController();

router.get('/', validate(listDocumentTypesSchema), controller.list);
router.get('/:id', validate(documentTypeIdSchema), controller.getOne);
router.post('/', validate(createDocumentTypeSchema), controller.create);
router.put('/:id', validate(updateDocumentTypeSchema), controller.update);
router.delete('/:id', validate(documentTypeIdSchema), controller.remove);

export default router;
