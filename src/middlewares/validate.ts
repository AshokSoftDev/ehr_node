import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      return res.status(400).json({ message: 'Validation error', errors: e.errors });
    }
  };
