import { Router } from 'express';
import { SurgeryController } from './surgery.controller';
import { validate } from '../../../middleware/validate.middleware';
import {
  createSurgerySchema,
  updateSurgerySchema,
  getSurgeryByIdSchema,
  deleteSurgerySchema,
  listSurgerySchema,
} from './surgery.schema';

const router = Router();
const controller = new SurgeryController();

router.get('/', validate(listSurgerySchema), controller.list);
router.get('/:id', validate(getSurgeryByIdSchema), controller.getById);
router.post('/', validate(createSurgerySchema), controller.create);
router.put('/:id', validate(updateSurgerySchema), controller.update);
router.delete('/:id', validate(deleteSurgerySchema), controller.delete);

export default router;
