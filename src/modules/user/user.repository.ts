import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userRepository = {
  create: async (data: any) => {
    return prisma.user.create({ data });
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { userId: id },
      include: { group: true },
    });
  },

  findAll: async () => {
    return prisma.user.findMany({ include: { group: true } });
  },

  update: async (id: string, data: any) => {
    return prisma.user.update({
      where: { userId: id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.user.delete({
      where: { userId: id },
    });
  },
};
