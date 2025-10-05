import { z } from 'zod';

export const createGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Group name is required').max(100),
    description: z.string().optional(),
    permissions: z.array(
      z.object({
        moduleId: z.string().uuid('Invalid module ID'),
        hasAccess: z.boolean(),
        subModules: z.array(
          z.object({
            subModuleId: z.string().uuid('Invalid sub-module ID'),
            allowed: z.boolean(),
          })
        ),
      })
    ),
  }),
});

export const updateGroupSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid group ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Group name is required').max(100),
    description: z.string().optional(),
    permissions: z.array(
      z.object({
        moduleId: z.string().uuid('Invalid module ID'),
        hasAccess: z.boolean(),
        subModules: z.array(
          z.object({
            subModuleId: z.string().uuid('Invalid sub-module ID'),
            allowed: z.boolean(),
          })
        ),
      })
    ),
  }),
});

export const deleteGroupSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid group ID'),
  }),
});

export const getGroupSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid group ID'),
  }),
});

export const listGroupsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type DeleteGroupInput = z.infer<typeof deleteGroupSchema>;
export type GetGroupInput = z.infer<typeof getGroupSchema>;
export type ListGroupsInput = z.infer<typeof listGroupsSchema>;
