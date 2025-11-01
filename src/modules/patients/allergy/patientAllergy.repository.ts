import { prisma } from '../../../utils/prisma';
import { PatientAllergy } from '@prisma/client';
import { CreatePatientAllergyDto, UpdatePatientAllergyDto } from './patientAllergy.types';

export class PatientAllergyRepository {
  async create(
    patientId: number,
    data: CreatePatientAllergyDto & { createdBy?: string; updatedBy?: string }
  ): Promise<PatientAllergy> {
    return prisma.patientAllergy.create({
      data: { ...data, patient_id: patientId },
    });
  }

  async findById(paId: number): Promise<PatientAllergy | null> {
    return prisma.patientAllergy.findUnique({ where: { pa_id: paId } });
  }

  async listByPatientId(patientId: number, search?: string): Promise<PatientAllergy[]> {
    return prisma.patientAllergy.findMany({
      where: {
        patient_id: patientId,
        status: 1,
        ...(search && { allergyName: { contains: search, mode: 'insensitive' } }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    paId: number,
    data: UpdatePatientAllergyDto & { updatedBy?: string }
  ): Promise<PatientAllergy> {
    return prisma.patientAllergy.update({
      where: { pa_id: paId },
      data,
    });
  }

  async softDelete(paId: number, deletedBy?: string): Promise<PatientAllergy> {
    return prisma.patientAllergy.update({
      where: { pa_id: paId },
      data: {
        status: 0,
        deletedAt: new Date(),
        deletedBy: deletedBy ?? null,
      },
    });
  }
}

