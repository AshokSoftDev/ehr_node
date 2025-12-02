import { Prisma } from '@prisma/client';
import { prisma } from '../../utils/prisma';
import { GroupFilters, GroupResponse } from './group.types';

export class GroupRepository {
  async create(data: Prisma.GroupCreateInput) {
    return await prisma.group.create({
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

  async findById(id: string) {
    return await prisma.group.findUnique({
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

  async findByName(name: string) {
    return await prisma.group.findUnique({
      where: { name },
    });
  }

  async findMany(filters: GroupFilters) {
    const { search, page = 1, limit = 10 } = filters;
    // const where: Prisma.GroupWhereInput = {
    //     id: {
    //         not: '6b9fd470-bc05-4465-9ed8-7f6f093d337c',
    //       },
    // };

    const ROOT_GROUP_ID = '01c00067-801a-4464-8c19-a5f7047dc5ac';
    const where: Prisma.GroupWhereInput = {
      id: { not: ROOT_GROUP_ID },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
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
      prisma.group.count({ where }),
    ]);

    return { groups, total };
  }

  async update(id: string, data: Prisma.GroupUpdateInput) {
    return await prisma.group.update({
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

  async delete(id: string) {
    return await prisma.group.delete({
      where: { id },
    });
  }

  async hasUsers(id: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { groupId: id },
    });
    return count > 0;
  }

  async deleteGroupPermissions(groupId: string) {
    await prisma.groupSubModulePermission.deleteMany({
      where: { groupId },
    });
    await prisma.groupModulePermission.deleteMany({
      where: { groupId },
    });
  }

  async createModulePermission(data: Prisma.GroupModulePermissionCreateInput) {
    return await prisma.groupModulePermission.create({
      data,
    });
  }

  async createSubModulePermissions(data: Prisma.GroupSubModulePermissionCreateManyInput[]) {
    return await prisma.groupSubModulePermission.createMany({
      data,
    });
  }

  async getAllModules() {
    return await prisma.module.findMany({
      include: {
        subModules: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
