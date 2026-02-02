"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const group_repository_1 = require("./group.repository");
const prisma_1 = require("../../utils/prisma");
const ROOT_GROUP_ID = 'dc248239-64e2-4703-a21c-6eec31c2ea91';
class GroupService {
    constructor() {
        this.groupRepository = new group_repository_1.GroupRepository();
    }
    async createGroup(data, createdBy) {
        // Check if group name already exists
        const existingGroup = await this.groupRepository.findByName(data.name);
        if (existingGroup) {
            throw new Error('Group name already exists');
        }
        // Create group
        const group = await prisma_1.prisma.group.create({
            data: {
                name: data.name,
                description: data.description,
                createdBy,
            },
        });
        // Create permissions (no transaction to avoid transaction reuse issues)
        if (data.permissions && data.permissions.length > 0) {
            for (const permission of data.permissions) {
                if (permission.hasAccess) {
                    // Create module permission
                    const modulePermission = await prisma_1.prisma.groupModulePermission.create({
                        data: {
                            groupId: group.id,
                            moduleId: permission.moduleId,
                            hasAccess: permission.hasAccess,
                        },
                    });
                    // Create sub-module permissions
                    if (permission.subModules && permission.subModules.length > 0) {
                        const subModuleData = permission.subModules
                            .filter(sub => sub.allowed)
                            .map(sub => ({
                            groupId: group.id,
                            subModuleId: sub.subModuleId,
                            allowed: sub.allowed,
                            groupModulePermissionId: modulePermission.id,
                        }));
                        if (subModuleData.length > 0) {
                            await prisma_1.prisma.groupSubModulePermission.createMany({
                                data: subModuleData,
                            });
                        }
                    }
                }
            }
        }
        // Return created group with permissions
        return await this.groupRepository.findById(group.id);
    }
    async updateGroup(id, data, updatedBy) {
        if (id === ROOT_GROUP_ID) {
            throw new Error('Cannot update root group');
        }
        // Check if group exists
        const existingGroup = await this.groupRepository.findById(id);
        if (!existingGroup) {
            throw new Error('Group not found');
        }
        // Check if new name conflicts with another group
        if (existingGroup.name !== data.name) {
            const nameConflict = await this.groupRepository.findByName(data.name);
            if (nameConflict) {
                throw new Error('Group name already exists');
            }
        }
        // Use transaction to ensure data consistency
        // Update group basic info
        await prisma_1.prisma.group.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                updatedBy,
            },
        });
        // Delete existing permissions
        await prisma_1.prisma.groupSubModulePermission.deleteMany({
            where: { groupId: id },
        });
        await prisma_1.prisma.groupModulePermission.deleteMany({
            where: { groupId: id },
        });
        // Create new permissions
        if (data.permissions && data.permissions.length > 0) {
            for (const permission of data.permissions) {
                if (permission.hasAccess) {
                    // Create module permission
                    const modulePermission = await prisma_1.prisma.groupModulePermission.create({
                        data: {
                            groupId: id,
                            moduleId: permission.moduleId,
                            hasAccess: permission.hasAccess,
                        },
                    });
                    // Create sub-module permissions
                    if (permission.subModules && permission.subModules.length > 0) {
                        const subModuleData = permission.subModules
                            .filter(sub => sub.allowed)
                            .map(sub => ({
                            groupId: id,
                            subModuleId: sub.subModuleId,
                            allowed: sub.allowed,
                            groupModulePermissionId: modulePermission.id,
                        }));
                        if (subModuleData.length > 0) {
                            await prisma_1.prisma.groupSubModulePermission.createMany({
                                data: subModuleData,
                            });
                        }
                    }
                }
            }
        }
        // Return updated group with permissions
        return await this.groupRepository.findById(id);
    }
    async deleteGroup(id) {
        if (id === ROOT_GROUP_ID) {
            throw new Error('Cannot delete root group');
        }
        // Check if group exists
        const group = await this.groupRepository.findById(id);
        if (!group) {
            throw new Error('Group not found');
        }
        // Check if group has users
        const hasUsers = await this.groupRepository.hasUsers(id);
        if (hasUsers) {
            throw new Error('Cannot delete group with assigned users');
        }
        // Delete group and its permissions (cascade delete)
        return await prisma_1.prisma.$transaction(async (tx) => {
            await tx.groupSubModulePermission.deleteMany({
                where: { groupId: id },
            });
            await tx.groupModulePermission.deleteMany({
                where: { groupId: id },
            });
            await tx.group.delete({
                where: { id },
            });
        });
    }
    async getGroupById(id) {
        if (id === ROOT_GROUP_ID) {
            throw new Error('Group not found');
        }
        // if(id == "6b9fd470-bc05-4465-9ed8-7f6f093d337c"){
        //     throw new Error('Cannot get default group');
        // }
        const group = await this.groupRepository.findById(id);
        if (!group) {
            throw new Error('Group not found');
        }
        return this.transformGroupResponse(group);
    }
    async listGroups(filters) {
        const { groups, total } = await this.groupRepository.findMany(filters);
        const { page = 1, limit = 10 } = filters;
        return {
            groups: groups.map(group => this.transformGroupResponse(group)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getAllModules() {
        return await this.groupRepository.getAllModules();
    }
    transformGroupResponse(group) {
        return {
            id: group.id,
            name: group.name,
            description: group.description,
            createdAt: group.createdAt,
            createdBy: group.createdBy,
            updatedAt: group.updatedAt,
            updatedBy: group.updatedBy,
            _count: group._count,
            permissions: group.permissions?.map((permission) => ({
                moduleId: permission.moduleId,
                hasAccess: permission.hasAccess,
                module: permission.module,
                subModulePermissions: permission.subModulePermissions?.map((subPerm) => ({
                    subModule: subPerm.subModule,
                    allowed: subPerm.allowed,
                })),
            })),
        };
    }
}
exports.GroupService = GroupService;
