import { AppError } from '../../../utils/errors';
import { PatientAllergyRepository } from './patientAllergy.repository';
import { PatientAllergyPayload, PatientAllergyUpdatePayload } from './patientAllergy.types';

export class PatientAllergyService {
  private repo = new PatientAllergyRepository();

  async list(patientId: number, search?: string) {
    await this.ensurePatientActive(patientId);
    return this.repo.list(patientId, search);
  }

  async get(patientId: number, paId: number) {
    await this.ensurePatientActive(patientId);
    const record = await this.repo.findById(paId);
    if (!record || record.status === 0 || record.patient_id !== patientId) {
      throw new AppError('Patient allergy not found', 404);
    }
    return record;
  }

  async create(patientId: number, payload: PatientAllergyPayload, userId?: string) {
    await this.ensurePatientActive(patientId);
    return this.repo.create({
      patient_id: patientId,
      allergyName: payload.allergyName,
      allergy_id: payload.allergyId ?? null,
      status: payload.status ?? 1,
      createdBy: userId ?? null,
      updatedBy: userId ?? null,
    });
  }

  async update(patientId: number, paId: number, payload: PatientAllergyUpdatePayload, userId?: string) {
    await this.ensurePatientActive(patientId);
    const existing = await this.repo.findById(paId);
    if (!existing || existing.status === 0 || existing.patient_id !== patientId) {
      throw new AppError('Patient allergy not found', 404);
    }

    return this.repo.update(paId, {
      ...payload,
      allergyName: payload.allergyName ?? existing.allergyName,
      allergy_id: payload.allergyId ?? existing.allergy_id ?? null,
      updatedBy: userId ?? null,
    });
  }

  async remove(patientId: number, paId: number, userId?: string) {
    await this.ensurePatientActive(patientId);
    const existing = await this.repo.findById(paId);
    if (!existing || existing.status === 0 || existing.patient_id !== patientId) {
      throw new AppError('Patient allergy not found', 404);
    }

    return this.repo.update(paId, {
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
