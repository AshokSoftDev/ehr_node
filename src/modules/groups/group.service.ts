import { GroupRepository } from './group.repository';
import { CreateGroupDto, UpdateGroupDto, GroupFilters } from './group.types';
import { prisma } from '../../utils/prisma';

const ROOT_GROUP_ID = 'dc248239-64e2-4703-a21c-6eec31c2ea91';

export class GroupService {
  private groupRepository: GroupRepository;

  constructor() {
    this.groupRepository = new GroupRepository();
  }

  async createGroup(data: CreateGroupDto, createdBy?: string) {
    // Check if group name already exists
    const existingGroup = await this.groupRepository.findByName(data.name);
    if (existingGroup) {
      throw new Error('Group name already exists');
    }

    // Create group
    const group = await prisma.group.create({
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
          const modulePermission = await prisma.groupModulePermission.create({
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
              await prisma.groupSubModulePermission.createMany({
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

  async updateGroup(id: string, data: UpdateGroupDto, updatedBy?: string) {
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
    await prisma.group.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        updatedBy,
      },
    });

    // Delete existing permissions
    await prisma.groupSubModulePermission.deleteMany({
      where: { groupId: id },
    });
    await prisma.groupModulePermission.deleteMany({
      where: { groupId: id },
    });

    // Create new permissions
    if (data.permissions && data.permissions.length > 0) {
      for (const permission of data.permissions) {
        if (permission.hasAccess) {
          // Create module permission
          const modulePermission = await prisma.groupModulePermission.create({
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
              await prisma.groupSubModulePermission.createMany({
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

  async deleteGroup(id: string) {

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
    return await prisma.$transaction(async (tx) => {
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

  async getGroupById(id: string) {
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

  async listGroups(filters: GroupFilters) {
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

  private transformGroupResponse(group: any) {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      createdAt: group.createdAt,
      createdBy: group.createdBy,
      updatedAt: group.updatedAt,
      updatedBy: group.updatedBy,
      _count: group._count,
      permissions: group.permissions?.map((permission: any) => ({
        moduleId: permission.moduleId,
        hasAccess: permission.hasAccess,
        module: permission.module,
        subModulePermissions: permission.subModulePermissions?.map((subPerm: any) => ({
          subModule: subPerm.subModule,
          allowed: subPerm.allowed,
        })),
      })),
    };
  }
}
