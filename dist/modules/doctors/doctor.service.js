"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;
const doctor_repository_1 = require("./doctor.repository");
const errors_1 = require("../../utils/errors");
class DoctorService {
    constructor() {
        this.doctorRepository = new doctor_repository_1.DoctorRepository();
    }
    async createDoctor(dto, userId) {
        // Check if email already exists
        const existingDoctorByEmail = await this.doctorRepository.findByEmail(dto.email);
        if (existingDoctorByEmail) {
            throw new errors_1.AppError('Email already exists', 409);
        }
        // Check if licence number already exists
        const existingDoctorByLicence = await this.doctorRepository.findByLicenceNo(dto.licenceNo);
        if (existingDoctorByLicence) {
            throw new errors_1.AppError('Licence number already exists', 409);
        }
        // Create doctor
        const doctor = await this.doctorRepository.create({
            ...dto,
            createdBy: userId,
        });
        return doctor;
    }
    async updateDoctor(id, dto, userId) {
        const doctor = await this.doctorRepository.findById(id);
        if (!doctor) {
            throw new errors_1.AppError('Doctor not found', 404);
        }
        // Check if email is being updated and already exists
        if (dto.email && dto.email !== doctor.email) {
            const existingDoctor = await this.doctorRepository.findByEmail(dto.email);
            if (existingDoctor) {
                throw new errors_1.AppError('Email already exists', 409);
            }
        }
        // Check if licence number is being updated and already exists
        if (dto.licenceNo && dto.licenceNo !== doctor.licenceNo) {
            const existingDoctor = await this.doctorRepository.findByLicenceNo(dto.licenceNo);
            if (existingDoctor) {
                throw new errors_1.AppError('Licence number already exists', 409);
            }
        }
        const updatedDoctor = await this.doctorRepository.update(id, {
            ...dto,
            updatedBy: userId,
        });
        return updatedDoctor;
    }
    async getDoctorById(id) {
        const doctor = await this.doctorRepository.findById(id);
        if (!doctor) {
            throw new errors_1.AppError('Doctor not found', 404);
        }
        return doctor;
    }
    async getAllDoctors(filters, pagination) {
        return this.doctorRepository.findAll(filters, pagination);
    }
    async deleteDoctor(id, userId) {
        const doctor = await this.doctorRepository.findById(id);
        if (!doctor) {
            throw new errors_1.AppError('Doctor not found', 404);
        }
        if (doctor.status === 0) {
            throw new errors_1.AppError('Doctor is already inactive', 400);
        }
        const deletedDoctor = await this.doctorRepository.softDelete(id, userId);
        return deletedDoctor;
    }
}
exports.DoctorService = DoctorService;
