import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { PatientSocialHistoryController } from './patientSocialHistory.controller';
import {
  listPatientSocialHistorySchema,
  syncPatientSocialHistorySchema,
} from './patientSocialHistory.schema';

const router = Router({ mergeParams: true });
const controller = new PatientSocialHistoryController();

router.get('/', validate(listPatientSocialHistorySchema), controller.list);
router.put('/sync', validate(syncPatientSocialHistorySchema), controller.sync);

export default router;
