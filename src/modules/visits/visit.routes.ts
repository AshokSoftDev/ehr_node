import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { VisitController } from './visit.controller';
import { listVisitsSchema } from './visit.schema';
import { authenticate, requireModule } from '../../middleware/auth.middleware';
import clinicalNoteRoutes from './clinical-notes/clinicalNote.routes';
import prescriptionRoutes from './prescriptions/prescription.routes';
import prescriptionTemplateRoutes from './prescription-templates/prescriptionTemplate.routes';
import documentRoutes from './document/document.routes';

const router = Router();
const controller = new VisitController();

router.use(authenticate);
// router.use(authenticate, requireModule('Visits'));

router.use('/:visitId/clinical-notes', clinicalNoteRoutes);
router.use('/:visitId/prescriptions', prescriptionRoutes);
router.use('/:visitId/documents', documentRoutes);
router.use('/prescription-templates', prescriptionTemplateRoutes);

// List visits with filters and pagination
router.get('/', validate(listVisitsSchema), controller.list);

export default router;
