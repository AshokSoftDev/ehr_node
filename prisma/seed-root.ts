import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ROOT_EMAIL = 'root@admin.com';
const ROOT_PASSWORD = 'Admin@123';
const ROOT_GROUP_NAME = 'System Administrators';

async function main() {
  // Ensure group exists
  const adminGroup = await prisma.group.upsert({
    where: { name: ROOT_GROUP_NAME },
    update: {},
    create: {
      name: ROOT_GROUP_NAME,
      description: 'Full system access group',
    },
  });

  // Ensure root user exists and is linked to group
  const hashed = await bcrypt.hash(ROOT_PASSWORD, 10);
  const rootUser = await prisma.user.upsert({
    where: { email: ROOT_EMAIL },
    update: {
      groupId: adminGroup.id,
      accountType: 'parent',
      parentId: null,
    },
    create: {
      title: 'Mr',
      fullName: 'Root Administrator',
      firstName: 'Root',
      lastName: 'Admin',
      email: ROOT_EMAIL,
      password: hashed,
      phoneNumber: '+1234567890',
      accountType: 'parent',
      parentId: null,
      groupId: adminGroup.id,
      userStatus: 1,
    },
  });

  // Grant full permissions to the admin group for all modules/submodules
  const modules = await prisma.module.findMany({ include: { subModules: true } });

  for (const mod of modules) {
    const modulePermission = await prisma.groupModulePermission.upsert({
      where: { groupId_moduleId: { groupId: adminGroup.id, moduleId: mod.id } },
      update: { hasAccess: true },
      create: {
        groupId: adminGroup.id,
        moduleId: mod.id,
        hasAccess: true,
      },
    });

    if (mod.subModules.length) {
      for (const sub of mod.subModules) {
        await prisma.groupSubModulePermission.upsert({
          where: { groupId_subModuleId: { groupId: adminGroup.id, subModuleId: sub.id } },
          update: { allowed: true, groupModulePermissionId: modulePermission.id },
          create: {
            groupId: adminGroup.id,
            subModuleId: sub.id,
            allowed: true,
            groupModulePermissionId: modulePermission.id,
          },
        });
      }
    }
  }

  console.log('✅ Root user and admin permissions seeded.');
  console.log(`Root credentials -> email: ${ROOT_EMAIL} password: ${ROOT_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

