"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../../utils/prisma");
class UserRepository {
    async create(data) {
        const user = await prisma_1.prisma.user.create({
            data,
            include: {
                group: true,
                parent: true,
            },
        });
        return this.excludeSensitiveFields(user);
    }
    async findById(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { userId },
            include: {
                group: true,
                parent: true,
                children: true,
            },
        });
        return user ? this.excludeSensitiveFields(user) : null;
    }
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({
            where: { email },
            include: {
                group: true,
            },
        });
    }
    async update(userId, data) {
        const user = await prisma_1.prisma.user.update({
            where: { userId },
            data,
            include: {
                group: true,
                parent: true,
            },
        });
        return this.excludeSensitiveFields(user);
    }
    async delete(userId) {
        await prisma_1.prisma.user.delete({
            where: { userId },
        });
    }
    async findMany(filters, page = 1, limit = 10) {
        const where = {};
        if (filters.groupId)
            where.groupId = filters.groupId;
        if (filters.userStatus !== undefined)
            where.userStatus = filters.userStatus;
        if (filters.accountType)
            where.accountType = filters.accountType;
        if (filters.parentId)
            where.parentId = filters.parentId;
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
            prisma_1.prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    group: true,
                    parent: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.user.count({ where }),
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
    async findUsersByParent(parentId) {
        const users = await prisma_1.prisma.user.findMany({
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
    excludeSensitiveFields(user) {
        const { password, otp, otpExpiry, ...safeUser } = user;
        return safeUser;
    }
}
exports.UserRepository = UserRepository;
