import { Router } from 'express';
import userRoutes from '../modules/users/user.routes';
import groupRoutes from '../modules/groups/group.routes';
import moduleRoutes from '../modules/modules/module.routes';
import doctorRoutes from '../modules/doctors/doctor.routes';
import patientRoutes from '../modules/patients/patient.routes'
import visitRoutes from '../modules/visits/visit.routes';
import appointmentRoutes from '../modules/appointments/appointment.routes';
import masterRoutes from '../modules/master/master.routes';


const router = Router();

router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/modules', moduleRoutes);
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/visits', visitRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/master', masterRoutes);


export default router;
