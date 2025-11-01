import { prisma } from '../../../utils/prisma';
import { PatientEmergency } from '@prisma/client';
import { CreatePatientEmergencyDto, UpdatePatientEmergencyDto } from './patientEmergency.types';

export class PatientEmergencyRepository {
  async create(
    patientId: number,
    data: CreatePatientEmergencyDto & { createdBy?: string; updatedBy?: string }
  ): Promise<PatientEmergency> {
    return prisma.patientEmergency.create({
      data: { ...data, patient_id: patientId },
    });
  }

  async findById(peId: number): Promise<PatientEmergency | null> {
    return prisma.patientEmergency.findUnique({ where: { pe_id: peId } });
  }

  async listByPatientId(patientId: number): Promise<PatientEmergency[]> {
    return prisma.patientEmergency.findMany({
      where: { patient_id: patientId, status: 1 },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    peId: number,
    data: UpdatePatientEmergencyDto & { updatedBy?: string }
  ): Promise<PatientEmergency> {
    return prisma.patientEmergency.update({
      where: { pe_id: peId },
      data,
    });
  }

  async softDelete(peId: number, deletedBy?: string): Promise<PatientEmergency> {
    return prisma.patientEmergency.update({
      where: { pe_id: peId },
      data: {
        status: 0,
        deletedAt: new Date(),
        deletedBy: deletedBy ?? null,
      },
    });
  }
}

