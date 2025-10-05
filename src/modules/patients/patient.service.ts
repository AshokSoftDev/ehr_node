import { PatientRepository } from './patient.repository';
import { CreatePatientDto, UpdatePatientDto, PatientFilters, PaginationParams } from './patient.types';
import { AppError } from '../../utils/errors';

export class PatientService {
    private patientRepository = new PatientRepository();

    async createPatient(dto: CreatePatientDto, userId: string) {
        const patient = await this.patientRepository.create({
            ...dto,
            createdBy: userId,
            updatedBy: userId,
        });

        return patient;
    }

    async updatePatient(id: number, dto: UpdatePatientDto, userId: string) {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new AppError('Patient not found', 404);
        }

        const updatedPatient = await this.patientRepository.update(id, {
            ...dto,
            updatedBy: userId,
        });

        return updatedPatient;
    }

    async getPatientById(id: number) {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new AppError('Patient not found', 404);
        }
        return patient;
    }

    async getAllPatients(filters: PatientFilters, pagination: PaginationParams) {
        return this.patientRepository.findAll(filters, pagination);
    }

    async deletePatient(id: number, userId: string) {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new AppError('Patient not found', 404);
        }

        if (patient.activeStatus === 0) {
            throw new AppError('Patient is already inactive', 400);
        }

        const deletedPatient = await this.patientRepository.softDelete(id, userId);
        return deletedPatient;
    }
}
