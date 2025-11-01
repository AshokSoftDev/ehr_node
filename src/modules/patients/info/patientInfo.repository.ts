import { prisma } from '../../../utils/prisma';
import { PatientInfo } from '@prisma/client';
import { CreatePatientInfoDto, UpdatePatientInfoDto } from './patientInfo.types';

export class PatientInfoRepository {
  async upsertByPatientId(
    patientId: number,
    data: (CreatePatientInfoDto | UpdatePatientInfoDto) & { createdBy?: string; updatedBy: string }
  ): Promise<PatientInfo> {
    const existing = await prisma.patientInfo.findFirst({ where: { patient_id: patientId } });
    if (existing) {
      return prisma.patientInfo.update({
        where: { pi_id: existing.pi_id },
        data: { ...data, patient_id: patientId },
      });
    }
    return prisma.patientInfo.create({
      data: { ...(data as CreatePatientInfoDto & { createdBy: string; updatedBy: string }), patient_id: patientId },
    });
  }

  async create(patientId: number, data: CreatePatientInfoDto & { createdBy: string; updatedBy: string }): Promise<PatientInfo> {
    return prisma.patientInfo.create({
      data: { ...data, patient_id: patientId },
    });
  }

  async findByPatientId(patientId: number): Promise<PatientInfo | null> {
    return prisma.patientInfo.findFirst({ where: { patient_id: patientId } });
  }

  async updateByPatientId(patientId: number, data: UpdatePatientInfoDto & { updatedBy: string }): Promise<PatientInfo> {
    const existing = await this.findByPatientId(patientId);
    if (!existing) {
      throw new Error('Patient info not found');
    }
    return prisma.patientInfo.update({
      where: { pi_id: existing.pi_id },
      data,
    });
  }
}

