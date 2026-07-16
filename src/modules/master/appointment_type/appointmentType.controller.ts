import { Request, Response } from 'express';
import { AppointmentTypeService } from './appointmentType.service';

export class AppointmentTypeController {
  private service: AppointmentTypeService;

  constructor() {
    this.service = new AppointmentTypeService();
  }

  list = async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string;
      const status = req.query.status ? Number(req.query.status) : undefined;
      
      const data = await this.service.list(search, status);
      return res.status(200).json({ status: 'success', data });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'system';
      const data = await this.service.create({ ...req.body, createdBy: userId });
      return res.status(201).json({ status: 'success', data });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ status: 'error', message: error.message });
      }
      return res.status(500).json({ status: 'error', message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const userId = (req as any).user?.userId || 'system';
      const data = await this.service.update(id, { ...req.body, updatedBy: userId });
      return res.status(200).json({ status: 'success', data });
    } catch (error: any) {
      if (error.message === 'Appointment type not found') {
        return res.status(404).json({ status: 'error', message: error.message });
      }
      return res.status(500).json({ status: 'error', message: error.message });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const userId = (req as any).user?.userId || 'system';
      await this.service.remove(id, userId);
      return res.status(200).json({ status: 'success', message: 'Appointment type deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Appointment type not found') {
        return res.status(404).json({ status: 'error', message: error.message });
      }
      return res.status(500).json({ status: 'error', message: error.message });
    }
  };
}
