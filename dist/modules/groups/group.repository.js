"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRepository = void 0;
const prisma_1 = require("../../utils/prisma");
class GroupRepository {
    async create(data) {
        return await prisma_1.prisma.group.create({
            data,
            include: {
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
    }
    async findById(id) {
        return await prisma_1.prisma.group.findUnique({
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
    }
    async findByName(name) {
        return await prisma_1.prisma.group.findUnique({
            where: { name },
        });
    }
    async findMany(filters) {
        const { search, page = 1, limit = 10 } = filters;
        // const where: Prisma.GroupWhereInput = {
        //     id: {
        //         not: '6b9fd470-bc05-4465-9ed8-7f6f093d337c',
        //       },
        // };
        const ROOT_GROUP_ID = '01c00067-801a-4464-8c19-a5f7047dc5ac';
        const where = {
            id: { not: ROOT_GROUP_ID },
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [groups, total] = await Promise.all([
            prisma_1.prisma.group.findMany({
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
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.group.count({ where }),
        ]);
        return { groups, total };
    }
    async update(id, data) {
        return await prisma_1.prisma.group.update({
            where: { id },
            data,
            include: {
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
    }
    async delete(id) {
        return await prisma_1.prisma.group.delete({
            where: { id },
        });
    }
    async hasUsers(id) {
        const count = await prisma_1.prisma.user.count({
            where: { groupId: id },
        });
        return count > 0;
    }
    async deleteGroupPermissions(groupId) {
        await prisma_1.prisma.groupSubModulePermission.deleteMany({
            where: { groupId },
        });
        await prisma_1.prisma.groupModulePermission.deleteMany({
            where: { groupId },
        });
    }
    async createModulePermission(data) {
        return await prisma_1.prisma.groupModulePermission.create({
            data,
        });
    }
    async createSubModulePermissions(data) {
        return await prisma_1.prisma.groupSubModulePermission.createMany({
            data,
        });
    }
    async getAllModules() {
        return await prisma_1.prisma.module.findMany({
            include: {
                subModules: true,
            },
            orderBy: { name: 'asc' },
        });
    }
}
exports.GroupRepository = GroupRepository;
