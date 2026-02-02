"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientInfoService = void 0;
const errors_1 = require("../../../utils/errors");
const patientInfo_repository_1 = require("./patientInfo.repository");
class PatientInfoService {
    constructor() {
        this.repo = new patientInfo_repository_1.PatientInfoRepository();
    }
    async get(patientId) {
        await this.ensurePatientActive(patientId);
        return this.repo.getByPatientId(patientId);
    }
    async create(patientId, payload, userId) {
        const patient = await this.ensurePatientActive(patientId);
        const existing = await this.repo.getByPatientId(patientId);
        if (existing && existing.activeStatus === 1) {
            throw new errors_1.AppError('Patient info already exists', 400);
        }
        return this.repo.create({
            ...payload,
            patient_id: patient.patient_id,
            primaryDoctorId: payload.primaryDoctorId ?? null,
            createdBy: userId ?? null,
            updatedBy: userId ?? null,
        });
    }
    async update(patientId, payload, userId) {
        await this.ensurePatientActive(patientId);
        const existing = await this.repo.getByPatientId(patientId);
        if (!existing || existing.activeStatus === 0) {
            throw new errors_1.AppError('Patient info not found', 404);
        }
        return this.repo.update(patientId, {
            ...payload,
            primaryDoctorId: payload.primaryDoctorId ?? existing.primaryDoctorId ?? null,
            updatedBy: userId ?? null,
        });
    }
    async ensurePatientActive(patientId) {
        const patient = await this.repo.findPatient(patientId);
        if (!patient || patient.activeStatus === 0) {
            throw new errors_1.AppError('Patient not found', 404);
        }
        return patient;
    }
}
exports.PatientInfoService = PatientInfoService;
