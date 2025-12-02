import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PatientEmergencyController } from './patientEmergency.controller';
import {
  createPatientEmergencySchema,
  getPatientEmergencySchema,
  listPatientEmergencySchema,
  updatePatientEmergencySchema,
} from './patientEmergency.schema';

const router = Router({ mergeParams: true });
const controller = new PatientEmergencyController();

router.get('/', validate(listPatientEmergencySchema), controller.list);
router.get('/:peId', validate(getPatientEmergencySchema), controller.get);
router.post('/', validate(createPatientEmergencySchema), controller.create);
router.put('/:peId', validate(updatePatientEmergencySchema), controller.update);
router.delete('/:peId', validate(getPatientEmergencySchema), controller.remove);

export default router;
