import { GroupRepository } from './group.repository';
import { CreateGroupDto, UpdateGroupDto, GroupFilters } from './group.types';
import { AppError } from '../../utils/errors';
import { prisma } from '../../utils/prisma';

export class GroupService {
    private groupRepository = new GroupRepository();

    async createGroup(dto: CreateGroupDto, userId: string) {
        const existingGroup = await this.groupRepository.findByName(dto.name);
        if (existingGroup) {
            throw new AppError('Group name already exists', 409);
        }

        const { permissions, ...groupData } = dto;
        const group = await this.groupRepository.createWithPermissions({
            ...groupData,
            createdBy: userId,
        }, permissions);

        return group;
    }

    async getGroup(groupId: string) {
        const group = await this.groupRepository.findByIdWithPermissions(groupId);
        if (!group) {
            throw new AppError('Group not found', 404);
        }
        return group;
    }

    async updateGroup(groupId: string, dto: UpdateGroupDto, userId: string) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new AppError('Group not found', 404);
        }

        if (dto.name && dto.name !== group.name) {
            const existingGroup = await this.groupRepository.findByName(dto.name);
            if (existingGroup) {
                throw new AppError('Group name already exists', 409);
            }
        }

        const { permissions, ...groupData } = dto;
        return this.groupRepository.updateWithPermissions(groupId, {
            ...groupData,
            updatedBy: userId,
        }, permissions);
    }

    async deleteGroup(groupId: string) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new AppError('Group not found', 404);
        }

        const hasUsers = await this.groupRepository.checkGroupHasUsers(groupId);
        if (hasUsers) {
            throw new AppError('Cannot delete group with active users', 400);
        }

        await this.groupRepository.delete(groupId);
    }

    async listGroups(filters: GroupFilters, page: number, limit: number) {
        return this.groupRepository.findMany(filters, page, limit);
    }

    async getModules() {
        return prisma.module.findMany({
            include: {
                subModules: true,
            },
            orderBy: { name: 'asc' },
        });
    }
}
