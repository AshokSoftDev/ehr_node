import { AppError } from '../../../utils/errors';
import { PatientInfoRepository } from './patientInfo.repository';
import { PatientInfoPayload, PatientInfoUpdatePayload } from './patientInfo.types';

export class PatientInfoService {
  private repo = new PatientInfoRepository();

  async get(patientId: number) {
    await this.ensurePatientActive(patientId);
    return this.repo.getByPatientId(patientId);
  }

  async create(patientId: number, payload: PatientInfoPayload, userId?: string) {
    const patient = await this.ensurePatientActive(patientId);
    const existing = await this.repo.getByPatientId(patientId);
    if (existing && existing.activeStatus === 1) {
      throw new AppError('Patient info already exists', 400);
    }

    return this.repo.create({
      ...payload,
      patient_id: patient.patient_id,
      primaryDoctorId: payload.primaryDoctorId ?? null,
      createdBy: userId ?? null,
      updatedBy: userId ?? null,
    });
  }

  async update(patientId: number, payload: PatientInfoUpdatePayload, userId?: string) {
    await this.ensurePatientActive(patientId);
    const existing = await this.repo.getByPatientId(patientId);
    if (!existing || existing.activeStatus === 0) {
      throw new AppError('Patient info not found', 404);
    }

    return this.repo.update(patientId, {
      ...payload,
      primaryDoctorId: payload.primaryDoctorId ?? existing.primaryDoctorId ?? null,
      updatedBy: userId ?? null,
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
