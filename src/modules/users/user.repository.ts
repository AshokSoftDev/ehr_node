import { prisma } from '../../utils/prisma';
import { CreateUserDto, UpdateUserDto, UserFilters, SafeUser } from './user.types';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async create(data: CreateUserDto & { createdBy: string; parentId?: string; accountType: string }): Promise<SafeUser> {
    const user = await prisma.user.create({
      data,
      include: {
        group: true,
        parent: true,
      },
    });
    return this.excludeSensitiveFields(user);
  }

  async findById(userId: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        group: true,
        parent: true,
        children: true,
      },
    });
    return user ? this.excludeSensitiveFields(user) : null;
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        group: true,
      },
    });
  }

  async update(userId: string, data: UpdateUserDto & { updatedBy: string }): Promise<SafeUser> {
    const user = await prisma.user.update({
      where: { userId },
      data,
      include: {
        group: true,
        parent: true,
      },
    });
    return this.excludeSensitiveFields(user);
  }

  async delete(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { userId },
    });
  }

  async findMany(filters: UserFilters, page: number = 1, limit: number = 10) {
    const where: Prisma.UserWhereInput = {};

    if (filters.groupId) where.groupId = filters.groupId;
    if (filters.userStatus !== undefined) where.userStatus = filters.userStatus;
    if (filters.accountType) where.accountType = filters.accountType;
    if (filters.parentId) where.parentId = filters.parentId;
    if (filters.excludeRoot) {
      where.parentId = { not: null };
    }
    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          group: true,
          parent: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map(user => this.excludeSensitiveFields(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUsersByParent(parentId: string): Promise<SafeUser[]> {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { parentId },
          { userId: parentId },
        ],
      },
      include: {
        group: true,
        parent: true,
      },
    });
    return users.map(user => this.excludeSensitiveFields(user));
  }

  private excludeSensitiveFields(user: any): SafeUser {
    const { password, otp, otpExpiry, ...safeUser } = user;
    return safeUser;
  }
}
