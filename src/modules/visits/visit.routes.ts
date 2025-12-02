import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { VisitController } from './visit.controller';
import { listVisitsSchema } from './visit.schema';
import { authenticate, requireModule } from '../../middleware/auth.middleware';
import clinicalNoteRoutes from './clinical-notes/clinicalNote.routes';

const router = Router();
const controller = new VisitController();

router.use(authenticate);
// router.use(authenticate, requireModule('Visits'));

router.use('/:visitId/clinical-notes', clinicalNoteRoutes);

// List visits with filters and pagination
router.get('/', validate(listVisitsSchema), controller.list);

export default router;
