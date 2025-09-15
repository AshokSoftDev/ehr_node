import { Router } from 'express';
import { ModuleController } from './module.controller';
import { authenticate, requireRole } from '../../middleware/auth.middleware';

const router = Router();
const moduleController = new ModuleController();

router.use(authenticate);

// Public routes (for authenticated users)
router.get('/', moduleController.listModules);

// Admin only routes
router.post('/seed', requireRole('parent'), moduleController.seedModules);
router.post('/', requireRole('parent'), moduleController.addModule);
router.post('/:moduleId/submodules', requireRole('parent'), moduleController.addSubModule);

export default router;
