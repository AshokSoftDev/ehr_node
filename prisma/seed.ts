import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
      accountType: 'root',
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

}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
