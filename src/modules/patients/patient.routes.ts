import { Router } from 'express';
import { PatientController } from './patient.controller';
import { validate } from '../../middleware/validate.middleware';
import { 
    createPatientSchema, 
    updatePatientSchema, 
    getPatientSchema, 
    deletePatientSchema, 
    getAllPatientsSchema 
} from './patient.schema';

const router = Router();
const patientController = new PatientController();

router.post('/', validate(createPatientSchema), patientController.createPatient);
router.get('/', validate(getAllPatientsSchema), patientController.getAllPatients);
router.get('/:id', validate(getPatientSchema), patientController.getPatientById);
router.put('/:id', validate(updatePatientSchema), patientController.updatePatient);
router.delete('/:id', validate(deletePatientSchema), patientController.deletePatient);

export default router;
