import { prisma } from '../../../utils/prisma';

export class AppointmentTypeService {
  async list(search?: string, status?: number) {
    const where: any = { deletedAt: null };

    if (status !== undefined) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await prisma.masterAppointmentType.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(id: number) {
    const appointmentType = await prisma.masterAppointmentType.findFirst({
      where: { id, deletedAt: null },
    });

    if (!appointmentType) {
      throw new Error('Appointment type not found');
    }

    return appointmentType;
  }

  async create(data: {
    code: string;
    name: string;
    description?: string;
    duration_minutes: number;
    color_code?: string;
    status?: number;
    createdBy?: string;
  }) {
    // Check if code already exists
    const existing = await prisma.masterAppointmentType.findUnique({
      where: { code: data.code }
    });

    if (existing && !existing.deletedAt) {
      throw new Error('Appointment type with this code already exists');
    }

    // If it exists but is softly deleted, we might want to throw or handle differently, 
    // but findUnique by unique constraint might fail if there's a soft-deleted record with same code.
    // In our schema, code is @unique. Soft delete doesn't bypass @unique, so it will throw anyway if we create another.

    return await prisma.masterAppointmentType.create({
      data,
    });
  }

  async update(id: number, data: any) {
    // Verify exists
    await this.getOne(id);

    return await prisma.masterAppointmentType.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, deletedBy?: string) {
    // Verify exists
    await this.getOne(id);

    return await prisma.masterAppointmentType.update({
      where: { id },
      data: {
        status: 0,
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }
}
