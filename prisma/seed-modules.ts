import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type SeedModule = {
  name: string;
  description?: string;
  subModules: { name: string; description?: string }[];
};

// Modules/submodules aligned to current app features and routes
const seedModules: SeedModule[] = [
  {
    name: 'Dashboard',
    description: 'Overall application dashboard',
    subModules: [{ name: 'VIEW', description: 'View dashboard widgets' }],
  },
  {
    name: 'User Management',
    description: 'Manage users',
    subModules: [
      { name: 'VIEW', description: 'View users' },
      { name: 'CREATE', description: 'Create users' },
      { name: 'EDIT', description: 'Edit users' },
      { name: 'DELETE', description: 'Delete users' },
    ],
  },
  {
    name: 'Group Management',
    description: 'Manage groups and permissions',
    subModules: [
      { name: 'VIEW', description: 'View groups' },
      { name: 'CREATE', description: 'Create groups' },
      { name: 'EDIT', description: 'Edit groups' },
      { name: 'DELETE', description: 'Delete groups' },
      { name: 'MANAGE_PERMISSIONS', description: 'Assign permissions to groups' },
    ],
  },
  {
    name: 'Doctor Management',
    description: 'Manage doctors/providers',
    subModules: [
      { name: 'VIEW', description: 'View doctors' },
      { name: 'CREATE', description: 'Create doctors' },
      { name: 'EDIT', description: 'Edit doctors' },
      { name: 'DELETE', description: 'Delete doctors' },
    ],
  },
  {
    name: 'Patient Management',
    description: 'Manage patients and visits',
    subModules: [
      { name: 'VIEW', description: 'View patients' },
      { name: 'CREATE', description: 'Create patients' },
      { name: 'EDIT', description: 'Edit patients' },
      { name: 'DELETE', description: 'Delete patients' },
    ],
  },
  {
    name: 'Appointments',
    description: 'Manage appointments',
    subModules: [
      { name: 'VIEW', description: 'View appointments' },
      { name: 'CREATE', description: 'Create appointments' },
      { name: 'EDIT', description: 'Edit/reschedule appointments' },
      { name: 'DELETE', description: 'Cancel appointments' },
      { name: 'STATUS_UPDATE', description: 'Update appointment status' },
    ],
  },
  {
    name: 'Visits',
    description: 'Manage visits',
    subModules: [
      { name: 'VIEW', description: 'View visits' },
      { name: 'CREATE', description: 'Create visits' },
      { name: 'EDIT', description: 'Edit visits' },
      { name: 'DELETE', description: 'Delete visits' },
    ],
  },
  {
    name: 'Location Master',
    description: 'Manage locations',
    subModules: [
      { name: 'VIEW', description: 'View locations' },
      { name: 'CREATE', description: 'Create locations' },
      { name: 'EDIT', description: 'Edit locations' },
      { name: 'DELETE', description: 'Delete locations' },
    ],
  },
  {
    name: 'Settings',
    description: 'Application settings',
    subModules: [{ name: 'VIEW', description: 'View settings' }],
  },
  {
    name: 'Clinical Notes',
    description: 'Manage clinical notes',
    subModules: [
      { name: 'VIEW', description: 'View clinical notes' },
      { name: 'CREATE', description: 'Create clinical notes' },
      { name: 'EDIT', description: 'Edit clinical notes' },
      { name: 'DELETE', description: 'Delete clinical notes' },
    ],
  },
  {
    name: 'Billing',
    description: 'Manage billing and invoices',
    subModules: [
      { name: 'VIEW', description: 'View bills and invoices' },
      { name: 'CREATE', description: 'Create bills' },
      { name: 'EDIT', description: 'Edit bills' },
      { name: 'DELETE', description: 'Delete bills' },
      { name: 'MANAGE_INVOICES', description: 'Generate and manage invoices' },
    ],
  },
  {
    name: 'Drug Master',
    description: 'Manage drug directory',
    subModules: [
      { name: 'VIEW', description: 'View drugs' },
      { name: 'CREATE', description: 'Create drugs' },
      { name: 'EDIT', description: 'Edit drugs' },
      { name: 'DELETE', description: 'Delete drugs' },
    ],
  },
  {
    name: 'Document Type Master',
    description: 'Manage document types',
    subModules: [
      { name: 'VIEW', description: 'View document types' },
      { name: 'CREATE', description: 'Create document types' },
      { name: 'EDIT', description: 'Edit document types' },
      { name: 'DELETE', description: 'Delete document types' },
    ],
  },
  {
    name: 'AI Chat',
    description: 'AI Assistant features',
    subModules: [{ name: 'VIEW', description: 'Access AI chat assistant' }],
  },
];

async function main() {
  for (const mod of seedModules) {
    const module = await prisma.module.upsert({
      where: { name: mod.name },
      update: { description: mod.description },
      create: {
        name: mod.name,
        description: mod.description,
      },
    });

    // Upsert submodules (unique by module + name via findFirst fallback)
    for (const sub of mod.subModules) {
      const existing = await prisma.subModule.findFirst({
        where: { moduleId: module.id, name: sub.name },
      });

      if (existing) {
        await prisma.subModule.update({
          where: { id: existing.id },
          data: { description: sub.description },
        });
      } else {
        await prisma.subModule.create({
          data: { moduleId: module.id, name: sub.name, description: sub.description },
        });
      }
    }
  }

  console.log('✅ Modules and submodules seeded.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

