import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const controller = new DashboardController();

// All dashboard routes require authentication
router.use(authenticate);

// 1. Top KPI Metrics (Today vs Yesterday/Month)
router.get('/metrics', controller.getMetrics);

// 2. Patient Flow Pipeline (Booked -> Checked-in -> With Doctor -> Completed)
router.get('/pipeline', controller.getPipeline);

// 3. Upcoming Schedule Timeline
router.get('/schedule', controller.getSchedule);

// 4. Revenue Trend (Billed vs Collected)
router.get('/revenue-trend', controller.getRevenueTrend);

export default router;
