import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PatientPmhController } from './patientPmh.controller';
import {
  listPatientPmhSchema,
  syncPatientPmhSchema,
} from './patientPmh.schema';

const router = Router({ mergeParams: true });
const controller = new PatientPmhController();

router.get('/', validate(listPatientPmhSchema), controller.list);
router.put('/sync', validate(syncPatientPmhSchema), controller.sync);

export default router;
