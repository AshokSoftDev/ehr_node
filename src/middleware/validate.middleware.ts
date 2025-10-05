import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/errors';

export function validate(schema: ZodSchema<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Force reassign using Object.defineProperty
      if (validated.body !== undefined) {
        Object.defineProperty(req, 'body', {
          value: validated.body,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
      
      if (validated.query !== undefined) {
        Object.defineProperty(req, 'query', {
          value: validated.query,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
      
      if (validated.params !== undefined) {
        Object.defineProperty(req, 'params', {
          value: validated.params,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        next(new AppError(errorMessage, 400));
      } else {
        next(new AppError('Validation failed', 400));
      }
    }
  };
}

export function validateQuery(schema: ZodSchema<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = await schema.parseAsync(req.query || {});
      
      Object.defineProperty(req, 'query', {
        value: validatedQuery,
        writable: true,
        enumerable: true,
        configurable: true
      });
      
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
}

export function validateBody(schema: ZodSchema<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = await schema.parseAsync(req.body);
      
      Object.defineProperty(req, 'body', {
        value: validatedBody,
        writable: true,
        enumerable: true,
        configurable: true
      });
      
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
}

export function validateParams(schema: ZodSchema<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedParams = await schema.parseAsync(req.params);
      
      Object.defineProperty(req, 'params', {
        value: validatedParams,
        writable: true,
        enumerable: true,
        configurable: true
      });
      
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
}

function handleValidationError(error: unknown, next: NextFunction) {
  if (error instanceof ZodError) {
    const errorMessage = error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    next(new AppError(errorMessage, 400));
  } else {
    next(new AppError('Validation failed', 400));
  }
}
