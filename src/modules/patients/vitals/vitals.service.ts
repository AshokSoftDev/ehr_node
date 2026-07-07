import { VitalsRepository } from './vitals.repository';
import { Prisma } from '@prisma/client';
import { VitalFilters } from './vitals.types';

export class VitalsService {
  private repository: VitalsRepository;

  constructor() {
    this.repository = new VitalsRepository();
  }

  async list(filters: VitalFilters) {
    return this.repository.list(filters);
  }

  async getVital(patientId: number, vitalId: number) {
    const vital = await this.repository.getById(patientId, vitalId);
    if (!vital) {
      const error: any = new Error('Vital record not found');
      error.statusCode = 404;
      throw error;
    }
    return vital;
  }

  async createVital(
    patientId: number,
    data: Omit<Prisma.PatientVitalUncheckedCreateInput, 'patient_id' | 'createdBy'>,
    userId: string
  ) {
    return this.repository.create({
      ...data,
      patient_id: patientId,
      createdBy: userId,
    });
  }

  async updateVital(
    patientId: number,
    vitalId: number,
    data: Omit<Prisma.PatientVitalUncheckedUpdateInput, 'updatedBy'>,
    userId: string
  ) {
    await this.getVital(patientId, vitalId); // ensure it exists and belongs to patient
    return this.repository.update(vitalId, {
      ...data,
      updatedBy: userId,
    });
  }

  async deleteVital(patientId: number, vitalId: number, userId: string) {
    await this.getVital(patientId, vitalId);
    return this.repository.delete(vitalId, userId);
  }
}
