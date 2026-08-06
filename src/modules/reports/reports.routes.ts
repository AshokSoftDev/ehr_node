import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  getCatalogSchema,
  financialReportSchema,
  clinicalReportSchema,
  operationalReportSchema,
  demographicReportSchema,
  customReportSchema,
  aiInsightSchema,
} from './reports.schema';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const controller = new ReportsController();

// Secure all analytical route access with JWT authentication
router.use(authenticate);

router.get('/catalog', validate(getCatalogSchema), controller.getCatalog);
router.get('/financial', validate(financialReportSchema), controller.getFinancialReport);
router.get('/clinical', validate(clinicalReportSchema), controller.getClinicalReport);
router.get('/operational', validate(operationalReportSchema), controller.getOperationalReport);
router.get('/demographics', validate(demographicReportSchema), controller.getDemographicReport);
router.post('/custom', validate(customReportSchema), controller.getCustomReport);
router.post('/ai-insight', validate(aiInsightSchema), controller.generateAiInsight);

export default router;
