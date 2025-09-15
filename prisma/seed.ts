import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if root user already exists
  const existingRoot = await prisma.user.findUnique({
    where: { email: 'root@admin.com' },
  });

  if (existingRoot) {
    console.log('✅ Root user already exists');
    return;
  }

  // Create root user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  const rootUser = await prisma.user.create({
    data: {
      title: 'Mr',
      fullName: 'Root Administrator',
      firstName: 'Root',
      lastName: 'Admin',
      email: 'root@admin.com',
      password: hashedPassword,
      phoneNumber: '+1234567890',
      accountType: 'parent',
      userStatus: 1,
      // groupId is null for root user
      // parentId is null for root user
    },
  });

  console.log('✅ Root user created:', {
    userId: rootUser.userId,
    email: rootUser.email,
    fullName: rootUser.fullName,
  });

  // Optionally, create a default admin group for the root user
  const adminGroup = await prisma.group.create({
    data: {
      name: 'System Administrators',
      description: 'Full system access group for administrators',
      createdBy: rootUser.userId,
    },
  });

  // Update root user with the admin group
  await prisma.user.update({
    where: { userId: rootUser.userId },
    data: { groupId: adminGroup.id },
  });

  console.log('✅ Admin group created and assigned to root user');

  // Grant all permissions to admin group
  const modules = await prisma.module.findMany({
    include: { subModules: true },
  });

  for (const module of modules) {
    const modulePermission = await prisma.groupModulePermission.create({
      data: {
        groupId: adminGroup.id,
        moduleId: module.id,
        hasAccess: true,
      },
    });

    // Grant all submodule permissions
    if (module.subModules.length > 0) {
      await prisma.groupSubModulePermission.createMany({
        data: module.subModules.map(subModule => ({
          groupId: adminGroup.id,
          subModuleId: subModule.id,
          allowed: true,
          groupModulePermissionId: modulePermission.id,
        })),
      });
    }
  }

  console.log('✅ All permissions granted to admin group');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
