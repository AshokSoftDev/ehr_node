import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { DentalHpiController } from './dentalHpi.controller';
import {
  createDentalHpiSchema,
  updateDentalHpiSchema,
  listDentalHpiSchema,
  dentalHpiParamsSchema,
} from './dentalHpi.schema';

const router = Router({ mergeParams: true });
const controller = new DentalHpiController();

router.get('/', validate(listDentalHpiSchema), controller.list);
router.get('/:hpiId', validate(dentalHpiParamsSchema), controller.getOne);
router.post('/', validate(createDentalHpiSchema), controller.create);
router.put('/:hpiId', validate(updateDentalHpiSchema), controller.update);
router.delete('/:hpiId', validate(dentalHpiParamsSchema), controller.remove);

export default router;
