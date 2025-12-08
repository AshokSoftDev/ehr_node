import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PrescriptionController } from './prescription.controller';
import {
  prescriptionParamsSchema,
  createPrescriptionSchema,
  bulkCreatePrescriptionSchema,
  bulkUpdatePrescriptionSchema,
  bulkDeletePrescriptionSchema,
  listPrescriptionsSchema,
  updatePrescriptionSchema,
} from './prescription.schema';

const router = Router({ mergeParams: true });
const controller = new PrescriptionController();

router.get('/', validate(listPrescriptionsSchema), controller.list);
router.get('/:prescriptionId', validate(prescriptionParamsSchema), controller.getOne);
router.post('/', validate(createPrescriptionSchema), controller.create);
router.post('/bulk', validate(bulkCreatePrescriptionSchema), controller.bulkCreate);
router.put('/bulk', validate(bulkUpdatePrescriptionSchema), controller.bulkUpdate);
router.delete('/bulk', validate(bulkDeletePrescriptionSchema), controller.bulkDelete);
router.put('/:prescriptionId', validate(updatePrescriptionSchema), controller.update);
router.delete('/:prescriptionId', validate(prescriptionParamsSchema), controller.remove);

export default router;
