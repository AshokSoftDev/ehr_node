import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PatientInfoController } from './patientInfo.controller';
import {
  createPatientInfoSchema,
  getPatientInfoSchema,
  updatePatientInfoSchema,
} from './patientInfo.schema';

const router = Router({ mergeParams: true });
const controller = new PatientInfoController();

router.get('/', validate(getPatientInfoSchema), controller.get);
router.post('/', validate(createPatientInfoSchema), controller.create);
router.put('/', validate(updatePatientInfoSchema), controller.update);

export default router;
