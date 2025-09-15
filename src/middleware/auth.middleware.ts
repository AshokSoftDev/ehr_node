import { Request, Response, NextFunction } from 'express';
import { verifyJwt, JwtPayload } from '../utils/jwt';
import { AppError } from '../utils/errors';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                accountType: string;
                groupId?: string | null;
            };
        }
    }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new AppError('Authentication required', 401);
        }

        const payload = verifyJwt<JwtPayload>(token);

        // Set user info on request
        req.user = {
            userId: payload.sub,
            email: payload.email,
            accountType: payload.accountType,
            groupId: payload.groupId,
        };

        next();
    } catch (error: any) {
        next(new AppError(error.message || 'Invalid token', 401));
    }
}

// Optional: Add role-based middleware
export function requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Authentication required', 401));
        }

        if (!roles.includes(req.user.accountType)) {
            return next(new AppError('Insufficient permissions', 403));
        }

        next();
    };
}
