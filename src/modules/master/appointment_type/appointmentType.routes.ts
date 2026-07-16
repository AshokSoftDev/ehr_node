import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { AppointmentTypeController } from './appointmentType.controller';
import {
  listAppointmentTypeSchema,
  createAppointmentTypeSchema,
  updateAppointmentTypeSchema,
  deleteAppointmentTypeSchema,
} from './appointmentType.schema';

const router = Router();
const controller = new AppointmentTypeController();

router.get('/', validate(listAppointmentTypeSchema), controller.list);
router.post('/', validate(createAppointmentTypeSchema), controller.create);
router.put('/:id', validate(updateAppointmentTypeSchema), controller.update);
router.delete('/:id', validate(deleteAppointmentTypeSchema), controller.remove);

export default router;
