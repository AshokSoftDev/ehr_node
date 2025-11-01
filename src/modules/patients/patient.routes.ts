import { Router } from 'express';
import { PatientController } from './patient.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  createPatientSchema,
  updatePatientSchema,
  getPatientSchema,
  deletePatientSchema,
  getAllPatientsSchema,
} from './patient.schema';
import {
  createPatientInfoSchema,
  updatePatientInfoSchema,
  getPatientInfoSchema,
} from './info/patientInfo.schema';
import {
  createPatientEmergencySchema,
  updatePatientEmergencySchema,
  getPatientEmergencySchema,
  listPatientEmergencySchema,
  deletePatientEmergencySchema,
} from './emergency/patientEmergency.schema';
import { PatientInfoController } from './info/patientInfo.controller';
import { PatientEmergencyController } from './emergency/patientEmergency.controller';
import {
  listPatientAllergySchema,
  createPatientAllergySchema,
  updatePatientAllergySchema,
  deletePatientAllergySchema,
} from './allergy/patientAllergy.schema';
import { PatientAllergyController } from './allergy/patientAllergy.controller';

const router = Router();
const patientController = new PatientController();
const patientInfoController = new PatientInfoController();
const patientEmergencyController = new PatientEmergencyController();
const patientAllergyController = new PatientAllergyController();

router.post('/', validate(createPatientSchema), patientController.createPatient);
router.get('/', validate(getAllPatientsSchema), patientController.getAllPatients);
router.get('/:id', validate(getPatientSchema), patientController.getPatientById);
router.put('/:id', validate(updatePatientSchema), patientController.updatePatient);
router.delete('/:id', validate(deletePatientSchema), patientController.deletePatient);

// Patient Info routes
router.get('/:id/info', validate(getPatientInfoSchema), patientInfoController.get);
router.post('/:id/info', validate(createPatientInfoSchema), patientInfoController.create);
router.put('/:id/info', validate(updatePatientInfoSchema), patientInfoController.update);

// Patient Emergency routes
router.get('/:id/emergency', validate(listPatientEmergencySchema), patientEmergencyController.list);
router.get('/:id/emergency/:peId', validate(getPatientEmergencySchema), patientEmergencyController.get);
router.post('/:id/emergency', validate(createPatientEmergencySchema), patientEmergencyController.create);
router.put('/:id/emergency/:peId', validate(updatePatientEmergencySchema), patientEmergencyController.update);
router.delete('/:id/emergency/:peId', validate(deletePatientEmergencySchema), patientEmergencyController.remove);

// Patient Allergy routes
router.get('/:id/allergies', validate(listPatientAllergySchema), patientAllergyController.list);
router.post('/:id/allergies', validate(createPatientAllergySchema), patientAllergyController.create);
router.put('/:id/allergies/:paId', validate(updatePatientAllergySchema), patientAllergyController.update);
router.delete('/:id/allergies/:paId', validate(deletePatientAllergySchema), patientAllergyController.remove);
export default router;
