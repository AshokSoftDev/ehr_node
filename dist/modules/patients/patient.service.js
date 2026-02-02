"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const patient_repository_1 = require("./patient.repository");
const errors_1 = require("../../utils/errors");
class PatientService {
    constructor() {
        this.patientRepository = new patient_repository_1.PatientRepository();
    }
    async createPatient(dto, userId) {
        const patient = await this.patientRepository.create({
            ...dto,
            createdBy: userId,
            updatedBy: userId,
        });
        return patient;
    }
    async updatePatient(id, dto, userId) {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new errors_1.AppError('Patient not found', 404);
        }
        const updatedPatient = await this.patientRepository.update(id, {
            ...dto,
            updatedBy: userId,
        });
        return updatedPatient;
    }
    async getPatientById(id) {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new errors_1.AppError('Patient not found', 404);
        }
        return patient;
    }
    async getAllPatients(filters, pagination) {
        return this.patientRepository.findAll(filters, pagination);
    }
    async deletePatient(id, userId) {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new errors_1.AppError('Patient not found', 404);
        }
        if (patient.activeStatus === 0) {
            throw new errors_1.AppError('Patient is already inactive', 400);
        }
        const deletedPatient = await this.patientRepository.softDelete(id, userId);
        return deletedPatient;
    }
}
exports.PatientService = PatientService;
