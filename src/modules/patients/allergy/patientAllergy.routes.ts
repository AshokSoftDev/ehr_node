import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PatientAllergyController } from './patientAllergy.controller';
import {
  createPatientAllergySchema,
  getPatientAllergySchema,
  listPatientAllergySchema,
  updatePatientAllergySchema,
} from './patientAllergy.schema';

const router = Router({ mergeParams: true });
const controller = new PatientAllergyController();

router.get('/', validate(listPatientAllergySchema), controller.list);
router.get('/:paId', validate(getPatientAllergySchema), controller.get);
router.post('/', validate(createPatientAllergySchema), controller.create);
router.put('/:paId', validate(updatePatientAllergySchema), controller.update);
router.delete('/:paId', validate(getPatientAllergySchema), controller.remove);

export default router;
