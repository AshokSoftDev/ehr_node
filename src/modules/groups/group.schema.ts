import { z } from 'zod';

export const createGroupSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        permissions: z.array(z.object({
            moduleId: z.string().uuid(),
            hasAccess: z.boolean(),
            subModules: z.array(z.object({
                subModuleId: z.string().uuid(),
                allowed: z.boolean(),
            })).optional(),
        })).optional(),
    }),
});

export const updateGroupSchema = z.object({
    params: z.object({
        groupId: z.string().uuid(),
    }),
    body: z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        permissions: z.array(z.object({
            moduleId: z.string().uuid(),
            hasAccess: z.boolean(),
            subModules: z.array(z.object({
                subModuleId: z.string().uuid(),
                allowed: z.boolean(),
            })).optional(),
        })).optional(),
    }),
});

export const getGroupSchema = z.object({
    params: z.object({
        groupId: z.string().uuid(),
    }),
});

export const deleteGroupSchema = z.object({
    params: z.object({
        groupId: z.string().uuid(),
    }),
});

export const listGroupsSchema = z.object({
    query: z.object({
        page: z.string().optional().transform(val => val ? parseInt(val) : 1),
        limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
        search: z.string().optional(),
    }),
});
