"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listGroupsSchema = exports.getGroupSchema = exports.deleteGroupSchema = exports.updateGroupSchema = exports.createGroupSchema = void 0;
const zod_1 = require("zod");
exports.createGroupSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Group name is required').max(100),
        description: zod_1.z.string().optional(),
        permissions: zod_1.z.array(zod_1.z.object({
            moduleId: zod_1.z.string().uuid('Invalid module ID'),
            hasAccess: zod_1.z.boolean(),
            subModules: zod_1.z.array(zod_1.z.object({
                subModuleId: zod_1.z.string().uuid('Invalid sub-module ID'),
                allowed: zod_1.z.boolean(),
            })),
        })),
    }),
});
exports.updateGroupSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid group ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Group name is required').max(100),
        description: zod_1.z.string().optional(),
        permissions: zod_1.z.array(zod_1.z.object({
            moduleId: zod_1.z.string().uuid('Invalid module ID'),
            hasAccess: zod_1.z.boolean(),
            subModules: zod_1.z.array(zod_1.z.object({
                subModuleId: zod_1.z.string().uuid('Invalid sub-module ID'),
                allowed: zod_1.z.boolean(),
            })),
        })),
    }),
});
exports.deleteGroupSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid group ID'),
    }),
});
exports.getGroupSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid group ID'),
    }),
});
exports.listGroupsSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
        page: zod_1.z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: zod_1.z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    }),
});
