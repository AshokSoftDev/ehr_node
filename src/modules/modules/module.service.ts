import { prisma } from '../../utils/prisma';
import { AppError } from '../../utils/errors';

interface CreateModuleDto {
    name: string;
    description?: string;
}

interface CreateSubModuleDto {
    name: string;
    description?: string;
}

export class ModuleService {
    // Predefined modules and submodules for healthcare system
    private readonly defaultModules = [
        {
            name: 'User Management',
            description: 'Manage system users and their access',
            subModules: [
                { name: 'View', description: 'View user list and details' },
                { name: 'Create', description: 'Create new users' },
                { name: 'Edit', description: 'Edit user information' },
                { name: 'Delete', description: 'Delete users' },
                { name: 'Export', description: 'Export user data' },
            ],
        },
        {
            name: 'Patient Management',
            description: 'Manage patient records and information',
            subModules: [
                { name: 'View', description: 'View patient records' },
                { name: 'Create', description: 'Register new patients' },
                { name: 'Edit', description: 'Update patient information' },
                { name: 'Delete', description: 'Delete patient records' },
                { name: 'Medical History', description: 'View and manage medical history' },
                { name: 'Export', description: 'Export patient data' },
            ],
        },
        {
            name: 'Appointment Management',
            description: 'Manage appointments and scheduling',
            subModules: [
                { name: 'View', description: 'View appointments' },
                { name: 'Create', description: 'Schedule new appointments' },
                { name: 'Edit', description: 'Reschedule appointments' },
                { name: 'Cancel', description: 'Cancel appointments' },
                { name: 'Calendar View', description: 'View appointment calendar' },
            ],
        },
        {
            name: 'Medical Records',
            description: 'Manage electronic health records',
            subModules: [
                { name: 'View', description: 'View medical records' },
                { name: 'Create', description: 'Create new records' },
                { name: 'Edit', description: 'Update medical records' },
                { name: 'Delete', description: 'Delete records' },
                { name: 'Upload Documents', description: 'Upload medical documents' },
                { name: 'Download', description: 'Download records' },
            ],
        },
        {
            name: 'Prescription Management',
            description: 'Manage prescriptions and medications',
            subModules: [
                { name: 'View', description: 'View prescriptions' },
                { name: 'Create', description: 'Create new prescriptions' },
                { name: 'Edit', description: 'Modify prescriptions' },
                { name: 'Delete', description: 'Delete prescriptions' },
                { name: 'Print', description: 'Print prescriptions' },
                { name: 'Refill', description: 'Manage prescription refills' },
            ],
        },
        {
            name: 'Billing & Invoicing',
            description: 'Manage billing and financial transactions',
            subModules: [
                { name: 'View', description: 'View invoices and bills' },
                { name: 'Create', description: 'Create new invoices' },
                { name: 'Edit', description: 'Edit invoices' },
                { name: 'Delete', description: 'Delete invoices' },
                { name: 'Payment', description: 'Process payments' },
                { name: 'Reports', description: 'Generate billing reports' },
            ],
        },
        {
            name: 'Laboratory Management',
            description: 'Manage lab tests and results',
            subModules: [
                { name: 'View', description: 'View lab tests and results' },
                { name: 'Create', description: 'Order new lab tests' },
                { name: 'Edit', description: 'Update test information' },
                { name: 'Delete', description: 'Delete test records' },
                { name: 'Upload Results', description: 'Upload lab results' },
                { name: 'Download', description: 'Download test reports' },
            ],
        },
        {
            name: 'Inventory Management',
            description: 'Manage medical inventory and supplies',
            subModules: [
                { name: 'View', description: 'View inventory' },
                { name: 'Add Stock', description: 'Add new inventory items' },
                { name: 'Update Stock', description: 'Update inventory levels' },
                { name: 'Delete', description: 'Remove inventory items' },
                { name: 'Stock Alert', description: 'Manage stock alerts' },
                { name: 'Reports', description: 'Generate inventory reports' },
            ],
        },
        {
            name: 'Reports & Analytics',
            description: 'Generate various reports and analytics',
            subModules: [
                { name: 'View Reports', description: 'View all reports' },
                { name: 'Generate Reports', description: 'Create new reports' },
                { name: 'Export', description: 'Export reports' },
                { name: 'Dashboard Access', description: 'Access analytics dashboard' },
            ],
        },
        {
            name: 'Settings',
            description: 'System settings and configuration',
            subModules: [
                { name: 'View', description: 'View system settings' },
                { name: 'General Settings', description: 'Manage general settings' },
                { name: 'Security Settings', description: 'Manage security settings' },
                { name: 'Backup', description: 'Manage system backups' },
                { name: 'Audit Logs', description: 'View system audit logs' },
            ],
        },
    ];

    async seedModules() {
        const modules = [];

        for (const moduleData of this.defaultModules) {
            // Check if module already exists
            let module = await prisma.module.findUnique({
                where: { name: moduleData.name },
            });

            if (!module) {
                // Create module
                module = await prisma.module.create({
                    data: {
                        name: moduleData.name,
                        description: moduleData.description,
                    },
                });

                // Create submodules
                if (moduleData.subModules && moduleData.subModules.length > 0) {
                    await prisma.subModule.createMany({
                        data: moduleData.subModules.map(sub => ({
                            moduleId: module?.id ?? "s",
                            name: sub.name,
                            description: sub.description,
                        })),
                        skipDuplicates: true,
                    });
                }
            }

            modules.push(module);
        }

        return modules;
    }

    async listModules() {
        return prisma.module.findMany({
            include: {
                subModules: {
                    orderBy: { name: 'asc' },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async addModule(dto: CreateModuleDto) {
        const existingModule = await prisma.module.findUnique({
            where: { name: dto.name },
        });

        if (existingModule) {
            throw new AppError('Module with this name already exists', 409);
        }

        return prisma.module.create({
            data: dto,
            include: {
                subModules: true,
            },
        });
    }

    async addSubModule(moduleId: string, dto: CreateSubModuleDto) {
        const module = await prisma.module.findUnique({
            where: { id: moduleId },
        });

        if (!module) {
            throw new AppError('Module not found', 404);
        }

        // Check if submodule already exists for this module
        const existingSubModule = await prisma.subModule.findFirst({
            where: {
                moduleId,
                name: dto.name,
            },
        });

        if (existingSubModule) {
            throw new AppError('SubModule with this name already exists for this module', 409);
        }

        return prisma.subModule.create({
            data: {
                ...dto,
                moduleId,
            },
        });
    }
}
