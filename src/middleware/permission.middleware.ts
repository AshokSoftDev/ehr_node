import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { AppError } from '../utils/errors';
import { prisma } from '../utils/prisma';

export function requireGroupPermission(moduleId: string, subModuleAction?: string) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.groupId) {
                throw new AppError('No group assigned', 403);
            }

            // Check module permission
            const modulePermission = await prisma.groupModulePermission.findFirst({
                where: {
                    groupId: req.user.groupId,
                    moduleId,
                    hasAccess: true,
                },
            });

            if (!modulePermission) {
                throw new AppError('Access denied to this module', 403);
            }

            // If submodule action specified, check that too
            if (subModuleAction) {
                const subModule = await prisma.subModule.findFirst({
                    where: {
                        moduleId,
                        name: subModuleAction,
                    },
                });

                if (subModule) {
                    const subModulePermission = await prisma.groupSubModulePermission.findFirst({
                        where: {
                            groupId: req.user.groupId,
                            subModuleId: subModule.id,
                            allowed: true,
                        },
                    });

                    if (!subModulePermission) {
                        throw new AppError(`Access denied to ${subModuleAction} action`, 403);
                    }
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
