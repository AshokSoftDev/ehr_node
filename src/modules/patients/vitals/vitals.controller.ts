import { Request, Response, NextFunction } from 'express';
import { VitalsService } from './vitals.service';

export class VitalsController {
  private service: VitalsService;

  constructor() {
    this.service = new VitalsService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = Number(req.params.patientId);
      const { visitId, dateFrom, dateTo, search, page, limit } = req.query;

      const result = await this.service.list({
        patientId,
        visitId: visitId ? Number(visitId) : undefined,
        dateFrom: dateFrom ? String(dateFrom) : undefined,
        dateTo: dateTo ? String(dateTo) : undefined,
        search: search ? String(search) : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getVital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = Number(req.params.patientId);
      const vitalId = Number(req.params.vitalId);

      const result = await this.service.getVital(patientId, vitalId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  createVital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = Number(req.params.patientId);
      const userId = (req as any).user?.uid || 'system';
      
      const result = await this.service.createVital(patientId, req.body, userId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateVital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = Number(req.params.patientId);
      const vitalId = Number(req.params.vitalId);
      const userId = (req as any).user?.uid || 'system';

      const result = await this.service.updateVital(patientId, vitalId, req.body, userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteVital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = Number(req.params.patientId);
      const vitalId = Number(req.params.vitalId);
      const userId = (req as any).user?.uid || 'system';

      await this.service.deleteVital(patientId, vitalId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
