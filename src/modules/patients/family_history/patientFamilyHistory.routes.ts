import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PatientFamilyHistoryController } from './patientFamilyHistory.controller';
import {
  listPatientFamilyHistorySchema,
  syncPatientFamilyHistorySchema,
} from './patientFamilyHistory.schema';

const router = Router({ mergeParams: true });
const controller = new PatientFamilyHistoryController();

router.get('/', validate(listPatientFamilyHistorySchema), controller.list);
router.put('/sync', validate(syncPatientFamilyHistorySchema), controller.sync);

export default router;
