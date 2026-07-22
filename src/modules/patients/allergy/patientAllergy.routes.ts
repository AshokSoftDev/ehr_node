import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PatientAllergyController } from './patientAllergy.controller';
import {
  createPatientAllergySchema,
  getPatientAllergySchema,
  listPatientAllergySchema,
  updatePatientAllergySchema,
  syncPatientAllergiesSchema,
} from './patientAllergy.schema';

const router = Router({ mergeParams: true });
const controller = new PatientAllergyController();

router.get('/', validate(listPatientAllergySchema), controller.list);
router.put('/sync', validate(syncPatientAllergiesSchema), controller.sync);
router.get('/:paId', validate(getPatientAllergySchema), controller.get);
router.post('/', validate(createPatientAllergySchema), controller.create);
router.put('/:paId', validate(updatePatientAllergySchema), controller.update);
router.delete('/:paId', validate(getPatientAllergySchema), controller.remove);

export default router;
