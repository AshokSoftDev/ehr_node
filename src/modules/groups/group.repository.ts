import { prisma } from '../../utils/prisma';
import { CreateGroupDto, UpdateGroupDto, GroupFilters, GroupWithCounts, GroupWithPermissions } from './group.types';
import { Prisma } from '@prisma/client';

export class GroupRepository {
    async create(data: Omit<CreateGroupDto, 'permissions'> & { createdBy: string }): Promise<GroupWithCounts> {
        return prisma.group.create({
            data,
            include: {
                _count: {
                    select: {
                        users: true,
                        permissions: true,
                    },
                },
            },
        });
    }

    async findById(id: string): Promise<GroupWithCounts | null> {
        return prisma.group.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        users: true,
                        permissions: true,
                    },
                },
            },
        });
    }

    async findByName(name: string) {
        return prisma.group.findUnique({
            where: { name },
        });
    }

    async update(id: string, data: Omit<UpdateGroupDto, 'permissions'> & { updatedBy: string }): Promise<GroupWithCounts> {
        return prisma.group.update({
            where: { id },
            data,
            include: {
                _count: {
                    select: {
                        users: true,
                        permissions: true,
                    },
                },
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.group.delete({
            where: { id },
        });
    }

    async findMany(filters: GroupFilters, page: number = 1, limit: number = 10) {
        const where: Prisma.GroupWhereInput = {};

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const [groups, total] = await Promise.all([
            prisma.group.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    _count: {
                        select: {
                            users: true,
                            permissions: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.group.count({ where }),
        ]);

        return {
            groups,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async checkGroupHasUsers(id: string): Promise<boolean> {
        const count = await prisma.user.count({
            where: { groupId: id },
        });
        return count > 0;
    }

    async createWithPermissions(
        data: Omit<CreateGroupDto, 'permissions'> & { createdBy: string },
        permissions?: CreateGroupDto['permissions']
    ): Promise<GroupWithPermissions | null> {
        return prisma.$transaction(async (tx) => {
            const group = await tx.group.create({
                data,
                include: {
                    _count: {
                        select: {
                            users: true,
                            permissions: true,
                        },
                    },
                },
            });

            if (permissions && permissions.length > 0) {
                for (const perm of permissions) {
                    const modulePermission = await tx.groupModulePermission.create({
                        data: {
                            groupId: group.id,
                            moduleId: perm.moduleId,
                            hasAccess: perm.hasAccess,
                        },
                    });

                    if (perm.subModules && perm.subModules.length > 0) {
                        await tx.groupSubModulePermission.createMany({
                            data: perm.subModules.map(sub => ({
                                groupId: group.id,
                                subModuleId: sub.subModuleId,
                                allowed: sub.allowed,
                                groupModulePermissionId: modulePermission.id,
                            })),
                        });
                    }
                }
            }

            return this.findByIdWithPermissions(group.id);
        });
    }

    async updateWithPermissions(
        id: string,
        data: Omit<UpdateGroupDto, 'permissions'> & { updatedBy: string },
        permissions?: UpdateGroupDto['permissions']
    ): Promise<GroupWithPermissions | null> {
        return prisma.$transaction(async (tx) => {
            const group = await tx.group.update({
                where: { id },
                data,
                include: {
                    _count: {
                        select: {
                            users: true,
                            permissions: true,
                        },
                    },
                },
            });

            if (permissions !== undefined) {
                await tx.groupSubModulePermission.deleteMany({
                    where: { groupId: id },
                });
                await tx.groupModulePermission.deleteMany({
                    where: { groupId: id },
                });

                if (permissions.length > 0) {
                    for (const perm of permissions) {
                        const modulePermission = await tx.groupModulePermission.create({
                            data: {
                                groupId: id,
                                moduleId: perm.moduleId,
                                hasAccess: perm.hasAccess,
                            },
                        });

                        if (perm.subModules && perm.subModules.length > 0) {
                            await tx.groupSubModulePermission.createMany({
                                data: perm.subModules.map(sub => ({
                                    groupId: id,
                                    subModuleId: sub.subModuleId,
                                    allowed: sub.allowed,
                                    groupModulePermissionId: modulePermission.id,
                                })),
                            });
                        }
                    }
                }
            }

            return this.findByIdWithPermissions(id);
        });
    }

    async findByIdWithPermissions(id: string): Promise<GroupWithPermissions | null> {
        const group = await prisma.group.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        users: true,
                        permissions: true,
                    },
                },
                permissions: {
                    include: {
                        module: {
                            include: {
                                subModules: true,
                            },
                        },
                        subModulePermissions: {
                            include: {
                                subModule: true,
                            },
                        },
                    },
                },
            },
        });

        return group;
    }
}
