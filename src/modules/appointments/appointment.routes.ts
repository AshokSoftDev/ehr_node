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
  listCheckedOutAppointmentsSchema,
} from './appointment.schema';
import { authenticate, requireModule } from '../../middleware/auth.middleware';

const router = Router();
const controller = new AppointmentController();

// All appointment routes require auth + module permission
router.use(authenticate, requireModule('Appointments'));

// Search MRN -> patient_id + mrn list
router.get('/search/mrn', validate(searchMrnSchema), controller.searchMrn);

// Doctors list
router.get('/doctors', validate(doctorsListSchema), controller.doctors);
router.get('/completed', validate(listCheckedOutAppointmentsSchema), controller.listCheckedOut);

// Appointments CRUD + list
router.get('/', validate(listAppointmentsSchema), controller.list);
router.post('/', validate(createAppointmentSchema), controller.create);
router.put('/:id', validate(updateAppointmentSchema), controller.update);
router.delete('/:id', validate(deleteAppointmentSchema), controller.remove);

export default router;
