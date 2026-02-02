"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireGroupPermission = requireGroupPermission;
const errors_1 = require("../utils/errors");
const prisma_1 = require("../utils/prisma");
function requireGroupPermission(moduleId, subModuleAction) {
    return async (req, res, next) => {
        try {
            if (!req.user?.groupId) {
                throw new errors_1.AppError('No group assigned', 403);
            }
            // Check module permission
            const modulePermission = await prisma_1.prisma.groupModulePermission.findFirst({
                where: {
                    groupId: req.user.groupId,
                    moduleId,
                    hasAccess: true,
                },
            });
            if (!modulePermission) {
                throw new errors_1.AppError('Access denied to this module', 403);
            }
            // If submodule action specified, check that too
            if (subModuleAction) {
                const subModule = await prisma_1.prisma.subModule.findFirst({
                    where: {
                        moduleId,
                        name: subModuleAction,
                    },
                });
                if (subModule) {
                    const subModulePermission = await prisma_1.prisma.groupSubModulePermission.findFirst({
                        where: {
                            groupId: req.user.groupId,
                            subModuleId: subModule.id,
                            allowed: true,
                        },
                    });
                    if (!subModulePermission) {
                        throw new errors_1.AppError(`Access denied to ${subModuleAction} action`, 403);
                    }
                }
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
