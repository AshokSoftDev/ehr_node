import { AppError } from '../../../utils/errors';
import { PatientEmergencyRepository } from './patientEmergency.repository';
import { PatientEmergencyPayload, PatientEmergencyUpdatePayload } from './patientEmergency.types';

export class PatientEmergencyService {
  private repo = new PatientEmergencyRepository();

  async list(patientId: number) {
    await this.ensurePatientActive(patientId);
    return this.repo.list(patientId);
  }

  async get(patientId: number, peId: number) {
    await this.ensurePatientActive(patientId);
    const record = await this.repo.findById(peId);
    if (!record || record.status === 0 || record.patient_id !== patientId) {
      throw new AppError('Emergency contact not found', 404);
    }
    return record;
  }

  async create(patientId: number, payload: PatientEmergencyPayload, userId?: string) {
    await this.ensurePatientActive(patientId);
    return this.repo.create({
      ...payload,
      patient_id: patientId,
      status: payload.status ?? 1,
      createdBy: userId ?? null,
      updatedBy: userId ?? null,
    });
  }

  async update(patientId: number, peId: number, payload: PatientEmergencyUpdatePayload, userId?: string) {
    await this.ensurePatientActive(patientId);
    const existing = await this.repo.findById(peId);
    if (!existing || existing.status === 0 || existing.patient_id !== patientId) {
      throw new AppError('Emergency contact not found', 404);
    }

    return this.repo.update(peId, {
      ...payload,
      updatedBy: userId ?? null,
    });
  }

  async remove(patientId: number, peId: number, userId?: string) {
    await this.ensurePatientActive(patientId);
    const existing = await this.repo.findById(peId);
    if (!existing || existing.status === 0 || existing.patient_id !== patientId) {
      throw new AppError('Emergency contact not found', 404);
    }

    return this.repo.update(peId, {
      status: 0,
      deletedAt: new Date(),
      deletedBy: userId ?? null,
    });
  }

  private async ensurePatientActive(patientId: number) {
    const patient = await this.repo.findPatient(patientId);
    if (!patient || patient.activeStatus === 0) {
      throw new AppError('Patient not found', 404);
    }
    return patient;
  }
}
