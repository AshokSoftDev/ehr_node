import { DoctorRepository } from './doctor.repository';
import { CreateDoctorDto, UpdateDoctorDto, DoctorFilters, PaginationParams } from './doctor.types';
import { AppError } from '../../utils/errors';

export class DoctorService {
    private doctorRepository = new DoctorRepository();

    async createDoctor(dto: CreateDoctorDto, userId: string) {
        // Check if email already exists
        const existingDoctorByEmail = await this.doctorRepository.findByEmail(dto.email);
        if (existingDoctorByEmail) {
            throw new AppError('Email already exists', 409);
        }

        // Check if licence number already exists
        const existingDoctorByLicence = await this.doctorRepository.findByLicenceNo(dto.licenceNo);
        if (existingDoctorByLicence) {
            throw new AppError('Licence number already exists', 409);
        }

        // Create doctor
        const doctor = await this.doctorRepository.create({
            ...dto,
            createdBy: userId,
        });

        return doctor;
    }

    async updateDoctor(id: string, dto: UpdateDoctorDto, userId: string) {
        const doctor = await this.doctorRepository.findById(id);
        if (!doctor) {
            throw new AppError('Doctor not found', 404);
        }

        // Check if email is being updated and already exists
        if (dto.email && dto.email !== doctor.email) {
            const existingDoctor = await this.doctorRepository.findByEmail(dto.email);
            if (existingDoctor) {
                throw new AppError('Email already exists', 409);
            }
        }

        // Check if licence number is being updated and already exists
        if (dto.licenceNo && dto.licenceNo !== doctor.licenceNo) {
            const existingDoctor = await this.doctorRepository.findByLicenceNo(dto.licenceNo);
            if (existingDoctor) {
                throw new AppError('Licence number already exists', 409);
            }
        }

        const updatedDoctor = await this.doctorRepository.update(id, {
            ...dto,
            updatedBy: userId,
        });

        return updatedDoctor;
    }

    async getDoctorById(id: string) {
        const doctor = await this.doctorRepository.findById(id);
        if (!doctor) {
            throw new AppError('Doctor not found', 404);
        }
        return doctor;
    }

    async getAllDoctors(filters: DoctorFilters, pagination: PaginationParams) {
        return this.doctorRepository.findAll(filters, pagination);
    }

    async deleteDoctor(id: string, userId: string) {
        const doctor = await this.doctorRepository.findById(id);
        if (!doctor) {
            throw new AppError('Doctor not found', 404);
        }

        if (doctor.status === 0) {
            throw new AppError('Doctor is already inactive', 400);
        }

        const deletedDoctor = await this.doctorRepository.softDelete(id, userId);
        return deletedDoctor;
    }
}
