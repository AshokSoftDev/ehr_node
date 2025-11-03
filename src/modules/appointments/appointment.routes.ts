import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { AppointmentController } from './appointment.controller';
import {
  listAppointmentsSchema,
  createAppointmentSchema,
  updateAppointmentSchema,
  deleteAppointmentSchema,
  searchMrnSchema,
  doctorsListSchema,
} from './appointment.schema';

const router = Router();
const controller = new AppointmentController();

// Search MRN → patient_id + mrn list
router.get('/search/mrn', validate(searchMrnSchema), controller.searchMrn);

// Doctors list
router.get('/doctors', validate(doctorsListSchema), controller.doctors);

// Appointments CRUD + list
router.get('/', validate(listAppointmentsSchema), controller.list);
router.post('/', validate(createAppointmentSchema), controller.create);
router.put('/:id', validate(updateAppointmentSchema), controller.update);
router.delete('/:id', validate(deleteAppointmentSchema), controller.remove);

export default router;

