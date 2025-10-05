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

      // Type-safe assignment
      if (validated.body !== undefined) {
        req.body = validated.body;
      }
      if (validated.query !== undefined) {
        req.query = validated.query;
      }
      if (validated.params !== undefined) {
        req.params = validated.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Use 'issues' instead of 'errors'
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
      console.log(req.query);
      
      req.query = await schema.parseAsync(req.query || {});
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
}

// Specific validation for body
export function validateBody(schema: ZodSchema<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
}

// Specific validation for params
export function validateParams(schema: ZodSchema<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params);
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