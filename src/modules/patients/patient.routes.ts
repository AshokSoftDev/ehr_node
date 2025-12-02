import { Router } from 'express';
import { PatientController } from './patient.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate, requireModule } from '../../middleware/auth.middleware';
import patientInfoRoutes from './info/patientInfo.routes';
import patientEmergencyRoutes from './emergency/patientEmergency.routes';
import patientAllergyRoutes from './allergy/patientAllergy.routes';
import {
    createPatientSchema,
    updatePatientSchema,
    getPatientSchema,
    deletePatientSchema,
    getAllPatientsSchema
} from './patient.schema';

const router = Router();
const patientController = new PatientController();

router.use(authenticate);
// router.use(authenticate, requireModule('Patient Management'));

// Nested resources
router.use('/:patientId/info', patientInfoRoutes);
router.use('/:patientId/emergency', patientEmergencyRoutes);
router.use('/:patientId/allergies', patientAllergyRoutes);

router.post('/', validate(createPatientSchema), patientController.createPatient);
router.get('/', validate(getAllPatientsSchema), patientController.getAllPatients);
router.get('/:id', validate(getPatientSchema), patientController.getPatientById);
router.put('/:id', validate(updatePatientSchema), patientController.updatePatient);
router.delete('/:id', validate(deletePatientSchema), patientController.deletePatient);

export default router;
