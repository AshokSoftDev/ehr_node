import { AppError } from '../../../utils/errors';
import { PatientRepository } from '../patient.repository';
import { PatientEmergencyRepository } from './patientEmergency.repository';
import { CreatePatientEmergencyDto, UpdatePatientEmergencyDto } from './patientEmergency.types';

export class PatientEmergencyService {
  private patientRepository = new PatientRepository();
  private repo = new PatientEmergencyRepository();

  async list(patientId: number) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new AppError('Patient not found', 404);
    return this.repo.listByPatientId(patientId);
  }

  async get(patientId: number, peId: number) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new AppError('Patient not found', 404);
    const item = await this.repo.findById(peId);
    if (!item || item.patient_id !== patientId) throw new AppError('Emergency contact not found', 404);
    return item;
  }

  async create(patientId: number, dto: CreatePatientEmergencyDto, userId: string) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new AppError('Patient not found', 404);
    return this.repo.create(patientId, { ...dto, createdBy: userId, updatedBy: userId });
  }

  async update(patientId: number, peId: number, dto: UpdatePatientEmergencyDto, userId: string) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new AppError('Patient not found', 404);
    const existing = await this.repo.findById(peId);
    if (!existing || existing.patient_id !== patientId) throw new AppError('Emergency contact not found', 404);
    return this.repo.update(peId, { ...dto, updatedBy: userId });
  }

  async remove(patientId: number, peId: number, userId: string) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new AppError('Patient not found', 404);
    const existing = await this.repo.findById(peId);
    if (!existing || existing.patient_id !== patientId) throw new AppError('Emergency contact not found', 404);
    return this.repo.softDelete(peId, userId);
  }
}
