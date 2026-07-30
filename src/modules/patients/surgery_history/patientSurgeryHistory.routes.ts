import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PatientSurgeryHistoryController } from './patientSurgeryHistory.controller';
import {
  listPatientSurgeryHistorySchema,
  syncPatientSurgeryHistorySchema,
} from './patientSurgeryHistory.schema';

const router = Router({ mergeParams: true });
const controller = new PatientSurgeryHistoryController();

router.get('/', validate(listPatientSurgeryHistorySchema), controller.list);
router.put('/sync', validate(syncPatientSurgeryHistorySchema), controller.sync);

export default router;
