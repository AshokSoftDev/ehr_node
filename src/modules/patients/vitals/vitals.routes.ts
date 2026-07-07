import { Router } from 'express';
import { VitalsController } from './vitals.controller';
import { validate } from '../../../middleware/validate.middleware';
import {
  listVitalsSchema,
  getVitalSchema,
  createVitalSchema,
  updateVitalSchema,
} from './vitals.schema';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router({ mergeParams: true });
const controller = new VitalsController();

// All routes require authentication
router.use(authenticate);

router.get('/', validate(listVitalsSchema), controller.list);
router.post('/', validate(createVitalSchema), controller.createVital);
router.get('/:vitalId', validate(getVitalSchema), controller.getVital);
router.put('/:vitalId', validate(updateVitalSchema), controller.updateVital);
router.delete('/:vitalId', validate(getVitalSchema), controller.deleteVital);

export default router;
