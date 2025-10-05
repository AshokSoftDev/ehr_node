import { Router } from 'express';
import { DoctorController } from './doctor.controller';
import { validate, validateQuery } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import {
    createDoctorSchema,
    updateDoctorSchema,
    getDoctorSchema,
    deleteDoctorSchema,
    getAllDoctorsSchema,
} from './doctor.schema';

const router = Router();
const doctorController = new DoctorController();    

// All routes require authentication
router.use(authenticate);

// Doctor routes
router.post('/', validate(createDoctorSchema), doctorController.createDoctor);
router.get('/',  doctorController.getAllDoctors);
// router.get('/', validateQuery(getAllDoctorsSchema), doctorController.getAllDoctors);
router.get('/:id', validate(getDoctorSchema), doctorController.getDoctor);
router.put('/:id', validate(updateDoctorSchema), doctorController.updateDoctor);
router.delete('/:id', validate(deleteDoctorSchema), doctorController.deleteDoctor);

export default router;
