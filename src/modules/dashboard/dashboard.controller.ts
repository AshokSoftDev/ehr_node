import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
    private dashboardService = new DashboardService();

    getMetrics = async (req: Request, res: Response) => {
        try {
            const targetDate = req.query.date as string || new Date().toISOString().split('T')[0];
            const data = await this.dashboardService.getMetrics(targetDate);
            res.status(200).json({ success: true, message: 'Dashboard metrics fetched successfully', data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Internal server error' });
        }
    };

    getPipeline = async (req: Request, res: Response) => {
        try {
            const targetDate = req.query.date as string || new Date().toISOString().split('T')[0];
            const data = await this.dashboardService.getPipeline(targetDate);
            res.status(200).json({ success: true, message: 'Patient pipeline fetched successfully', data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Internal server error' });
        }
    };

    getSchedule = async (req: Request, res: Response) => {
        try {
            const targetDate = req.query.date as string || new Date().toISOString().split('T')[0];
            const limit = parseInt(req.query.limit as string) || 10;
            const data = await this.dashboardService.getSchedule(targetDate, limit);
            res.status(200).json({ success: true, message: 'Upcoming schedule fetched successfully', data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Internal server error' });
        }
    };

    getRevenueTrend = async (req: Request, res: Response) => {
        try {
            const days = parseInt(req.query.days as string) || 7;
            const data = await this.dashboardService.getRevenueTrend(days);
            res.status(200).json({ success: true, message: 'Revenue trend fetched successfully', data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Internal server error' });
        }
    };
}
