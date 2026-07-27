import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PmhController } from './pmh.controller';
import {
  createPmhSchema,
  getPmhSchema,
  listPmhSchema,
  updatePmhSchema,
} from './pmh.schema';

const router = Router();
const controller = new PmhController();

router.get('/', validate(listPmhSchema), controller.list);
router.post('/', validate(createPmhSchema), controller.create);
router.get('/:id', validate(getPmhSchema), controller.get);
router.put('/:id', validate(updatePmhSchema), controller.update);
router.delete('/:id', validate(getPmhSchema), controller.remove);

export default router;
