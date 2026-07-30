import { Request, Response, NextFunction } from 'express';
import { SurgeryService } from './surgery.service';

export class SurgeryController {
  private service: SurgeryService;

  constructor() {
    this.service = new SurgeryService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;
      const status = req.query.status !== undefined ? Number(req.query.status) : undefined;
      const data = await this.service.list(search, status);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = await this.service.getById(id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.user_id?.toString() || (req as any).user?.id?.toString();
      const data = await this.service.create(req.body, userId);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const userId = (req as any).user?.user_id?.toString() || (req as any).user?.id?.toString();
      const data = await this.service.update(id, req.body, userId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const userId = (req as any).user?.user_id?.toString() || (req as any).user?.id?.toString();
      await this.service.delete(id, userId);
      res.json({ success: true, message: 'Surgery procedure deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
