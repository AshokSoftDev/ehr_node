"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
exports.requireModule = requireModule;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const prisma_1 = require("../utils/prisma");
async function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new errors_1.AppError('Authentication required', 401);
        }
        const payload = (0, jwt_1.verifyJwt)(token);
        // Set user info on request
        req.user = {
            userId: payload.sub,
            email: payload.email,
            accountType: payload.accountType,
            groupId: payload.groupId,
            permissions: undefined,
        };
        next();
    }
    catch (error) {
        next(new errors_1.AppError(error.message || 'Invalid token', 401));
    }
}
// Optional: Add role-based middleware
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errors_1.AppError('Authentication required', 401));
        }
        if (!roles.includes(req.user.accountType)) {
            return next(new errors_1.AppError('Insufficient permissions', 403));
        }
        next();
    };
}
/**
 * Module-level permission middleware.
 * Checks if the authenticated user's group has access to the given moduleId.
 * Skips check for root-level users (parentId null) by checking accountType/parentId via DB lookup.
 */
function requireModule(moduleKey) {
    return async (req, _res, next) => {
        if (!req.user)
            return next(new errors_1.AppError('Authentication required', 401));
        // Root users: allow all
        const dbUser = await prisma_1.prisma.user.findUnique({
            where: { userId: req.user.userId },
            select: { parentId: true, groupId: true },
        });
        if (!dbUser)
            return next(new errors_1.AppError('User not found', 404));
        if (dbUser.parentId === null)
            return next(); // root-level
        // No group -> deny
        if (!dbUser.groupId)
            return next(new errors_1.AppError('Insufficient permissions', 403));
        // Resolve moduleId: if moduleKey is not an id, look up by name
        let moduleId = moduleKey;
        const isUuidLike = /^[0-9a-fA-F-]{32,36}$/.test(moduleKey);
        if (!isUuidLike) {
            const mod = await prisma_1.prisma.module.findFirst({
                where: { name: { equals: moduleKey, mode: 'insensitive' } },
                select: { id: true },
            });
            if (!mod)
                return next(new errors_1.AppError('Insufficient permissions', 403));
            moduleId = mod.id;
        }
        // Check group module permission
        const perm = await prisma_1.prisma.groupModulePermission.findUnique({
            where: { groupId_moduleId: { groupId: dbUser.groupId, moduleId } },
            select: { hasAccess: true },
        });
        if (!perm || !perm.hasAccess) {
            return next(new errors_1.AppError('You do not have access to this module', 403));
        }
        next();
    };
}
