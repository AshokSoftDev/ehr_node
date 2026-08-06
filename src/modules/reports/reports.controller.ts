import { Request, Response } from 'express';
import { ReportsService } from './reports.service';

export class ReportsController {
  private reportsService = new ReportsService();

  getCatalog = async (req: Request, res: Response) => {
    try {
      const data = await this.reportsService.getCatalog();
      res.status(200).json({ success: true, message: 'Reports catalog fetched successfully', data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error fetching reports catalog' });
    }
  };

  getFinancialReport = async (req: Request, res: Response) => {
    try {
      const data = await this.reportsService.getFinancialReport(req.query as any);
      res.status(200).json({ success: true, message: 'Financial report generated successfully', data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error generating financial report' });
    }
  };

  getClinicalReport = async (req: Request, res: Response) => {
    try {
      const data = await this.reportsService.getClinicalReport(req.query as any);
      res.status(200).json({ success: true, message: 'Clinical report generated successfully', data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error generating clinical report' });
    }
  };

  getOperationalReport = async (req: Request, res: Response) => {
    try {
      const data = await this.reportsService.getOperationalReport(req.query as any);
      res.status(200).json({ success: true, message: 'Operational report generated successfully', data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error generating operational report' });
    }
  };

  getDemographicReport = async (req: Request, res: Response) => {
    try {
      const data = await this.reportsService.getDemographicsReport(req.query as any);
      res.status(200).json({ success: true, message: 'Demographics report generated successfully', data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error generating demographics report' });
    }
  };

  getCustomReport = async (req: Request, res: Response) => {
    try {
      const data = await this.reportsService.getCustomReport(req.body);
      res.status(200).json({ success: true, message: 'Custom report executed successfully', data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error executing custom report query' });
    }
  };

  generateAiInsight = async (req: Request, res: Response) => {
    try {
      const data = await this.reportsService.generateAiInsight(req.body.query);
      res.status(200).json({ success: true, message: 'AI insight generated successfully', data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error generating AI analytical insight' });
    }
  };
}
