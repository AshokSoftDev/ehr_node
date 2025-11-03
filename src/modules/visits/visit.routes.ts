import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { VisitController } from './visit.controller';
import { listVisitsSchema } from './visit.schema';

const router = Router();
const controller = new VisitController();

// List visits with filters and pagination
router.get('/', validate(listVisitsSchema), controller.list);

export default router;

