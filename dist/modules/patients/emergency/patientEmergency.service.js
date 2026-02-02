"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientEmergencyService = void 0;
const errors_1 = require("../../../utils/errors");
const patientEmergency_repository_1 = require("./patientEmergency.repository");
class PatientEmergencyService {
    constructor() {
        this.repo = new patientEmergency_repository_1.PatientEmergencyRepository();
    }
    async list(patientId) {
        await this.ensurePatientActive(patientId);
        return this.repo.list(patientId);
    }
    async get(patientId, peId) {
        await this.ensurePatientActive(patientId);
        const record = await this.repo.findById(peId);
        if (!record || record.status === 0 || record.patient_id !== patientId) {
            throw new errors_1.AppError('Emergency contact not found', 404);
        }
        return record;
    }
    async create(patientId, payload, userId) {
        await this.ensurePatientActive(patientId);
        return this.repo.create({
            ...payload,
            patient_id: patientId,
            status: payload.status ?? 1,
            createdBy: userId ?? null,
            updatedBy: userId ?? null,
        });
    }
    async update(patientId, peId, payload, userId) {
        await this.ensurePatientActive(patientId);
        const existing = await this.repo.findById(peId);
        if (!existing || existing.status === 0 || existing.patient_id !== patientId) {
            throw new errors_1.AppError('Emergency contact not found', 404);
        }
        return this.repo.update(peId, {
            ...payload,
            updatedBy: userId ?? null,
        });
    }
    async remove(patientId, peId, userId) {
        await this.ensurePatientActive(patientId);
        const existing = await this.repo.findById(peId);
        if (!existing || existing.status === 0 || existing.patient_id !== patientId) {
            throw new errors_1.AppError('Emergency contact not found', 404);
        }
        return this.repo.update(peId, {
            status: 0,
            deletedAt: new Date(),
            deletedBy: userId ?? null,
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
exports.PatientEmergencyService = PatientEmergencyService;
