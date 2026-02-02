"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersSchema = exports.deleteUserSchema = exports.getUserSchema = exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1),
        fullName: zod_1.z.string().min(1),
        firstName: zod_1.z.string().min(1),
        lastName: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain uppercase, lowercase, number and special character'),
        phoneNumber: zod_1.z.string().optional(),
        groupId: zod_1.z.string().uuid().optional(),
        dob: zod_1.z.string().datetime().optional().transform(str => str ? new Date(str) : undefined),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        fullName: zod_1.z.string().min(1).optional(),
        firstName: zod_1.z.string().min(1).optional(),
        lastName: zod_1.z.string().min(1).optional(),
        phoneNumber: zod_1.z.string().optional(),
        groupId: zod_1.z.string().uuid().optional(),
        userStatus: zod_1.z.number().int().min(0).max(1).optional(),
        dob: zod_1.z.string().datetime().optional().transform(str => str ? new Date(str) : undefined),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }),
});
exports.getUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
    }),
});
exports.deleteUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
    }),
});
exports.listUsersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional().transform(val => val ? parseInt(val) : 1),
        limit: zod_1.z.string().optional().transform(val => val ? parseInt(val) : 10),
        groupId: zod_1.z.string().uuid().optional(),
        userStatus: zod_1.z.string().optional().transform(val => val ? parseInt(val) : undefined),
        accountType: zod_1.z.string().optional(),
        parentId: zod_1.z.string().uuid().optional(),
        search: zod_1.z.string().optional(),
    }),
});
