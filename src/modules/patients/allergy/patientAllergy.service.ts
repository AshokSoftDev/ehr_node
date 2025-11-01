import { AppError } from '../../../utils/errors';
import { PatientRepository } from '../patient.repository';
import { PatientAllergyRepository } from './patientAllergy.repository';
import { CreatePatientAllergyDto, UpdatePatientAllergyDto } from './patientAllergy.types';

export class PatientAllergyService {
  private patientRepository = new PatientRepository();
  private repo = new PatientAllergyRepository();

  async list(patientId: number, search?: string) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new AppError('Patient not found', 404);
    return this.repo.listByPatientId(patientId, search);
  }

  async create(patientId: number, dto: CreatePatientAllergyDto, userId: string) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new AppError('Patient not found', 404);
    return this.repo.create(patientId, { ...dto, createdBy: userId, updatedBy: userId });
  }

  async update(patientId: number, paId: number, dto: UpdatePatientAllergyDto, userId: string) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new AppError('Patient not found', 404);
    const existing = await this.repo.findById(paId);
    if (!existing || existing.patient_id !== patientId) throw new AppError('Patient allergy not found', 404);
    return this.repo.update(paId, { ...dto, updatedBy: userId });
  }

  async remove(patientId: number, paId: number, userId: string) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new AppError('Patient not found', 404);
    const existing = await this.repo.findById(paId);
    if (!existing || existing.patient_id !== patientId) throw new AppError('Patient allergy not found', 404);
    return this.repo.softDelete(paId, userId);
  }
}

