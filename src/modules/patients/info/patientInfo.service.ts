import { AppError } from '../../../utils/errors';
import { PatientRepository } from '../patient.repository';
import { PatientInfoRepository } from './patientInfo.repository';
import { CreatePatientInfoDto, UpdatePatientInfoDto } from './patientInfo.types';

export class PatientInfoService {
  private patientRepository = new PatientRepository();
  private patientInfoRepository = new PatientInfoRepository();

  async get(patientId: number) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    const info = await this.patientInfoRepository.findByPatientId(patientId);
    if (!info) {
      throw new AppError('Patient info not found', 404);
    }
    return info;
  }

  async create(patientId: number, dto: CreatePatientInfoDto, userId: string) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    const info = await this.patientInfoRepository.create(patientId, {
      ...dto,
      createdBy: userId,
      updatedBy: userId,
    });
    return info;
  }

  async upsert(patientId: number, dto: CreatePatientInfoDto | UpdatePatientInfoDto, userId: string) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    return this.patientInfoRepository.upsertByPatientId(patientId, {
      ...dto,
      updatedBy: userId,
      ...(await this.patientInfoRepository.findByPatientId(patientId)
        ? {}
        : { createdBy: userId }),
    });
  }

  async update(patientId: number, dto: UpdatePatientInfoDto, userId: string) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    const updated = await this.patientInfoRepository.updateByPatientId(patientId, {
      ...dto,
      updatedBy: userId,
    });
    return updated;
  }
}
