import { Router } from 'express';
import userRoutes from '../modules/users/user.routes';
import groupRoutes from '../modules/groups/group.routes';
import moduleRoutes from '../modules/modules/module.routes';
import doctorRoutes from '../modules/doctors/doctor.routes';


const router = Router();

router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/modules', moduleRoutes);
router.use('/doctors', doctorRoutes);

export default router;
