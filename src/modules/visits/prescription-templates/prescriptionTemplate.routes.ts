import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PrescriptionTemplateController } from './prescriptionTemplate.controller';
import {
  prescriptionTemplateParamsSchema,
  createPrescriptionTemplateSchema,
  bulkCreatePrescriptionTemplateSchema,
  listPrescriptionTemplatesSchema,
  updatePrescriptionTemplateSchema,
} from './prescriptionTemplate.schema';

const router = Router();
const controller = new PrescriptionTemplateController();

router.get('/', validate(listPrescriptionTemplatesSchema), controller.list);
router.get('/:tempId', validate(prescriptionTemplateParamsSchema), controller.getOne);
router.post('/', validate(createPrescriptionTemplateSchema), controller.create);
router.post('/bulk', validate(bulkCreatePrescriptionTemplateSchema), controller.bulkCreate);
router.put('/:tempId', validate(updatePrescriptionTemplateSchema), controller.update);
router.delete('/:tempId', validate(prescriptionTemplateParamsSchema), controller.remove);

export default router;
