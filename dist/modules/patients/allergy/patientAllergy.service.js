"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientAllergyService = void 0;
const errors_1 = require("../../../utils/errors");
const patientAllergy_repository_1 = require("./patientAllergy.repository");
class PatientAllergyService {
    constructor() {
        this.repo = new patientAllergy_repository_1.PatientAllergyRepository();
    }
    async list(patientId, search) {
        await this.ensurePatientActive(patientId);
        return this.repo.list(patientId, search);
    }
    async get(patientId, paId) {
        await this.ensurePatientActive(patientId);
        const record = await this.repo.findById(paId);
        if (!record || record.status === 0 || record.patient_id !== patientId) {
            throw new errors_1.AppError('Patient allergy not found', 404);
        }
        return record;
    }
    async create(patientId, payload, userId) {
        await this.ensurePatientActive(patientId);
        return this.repo.create({
            patient_id: patientId,
            allergyName: payload.allergyName,
            allergy_id: payload.allergyId ?? null,
            status: payload.status ?? 1,
            createdBy: userId ?? null,
            updatedBy: userId ?? null,
        });
    }
    async update(patientId, paId, payload, userId) {
        await this.ensurePatientActive(patientId);
        const existing = await this.repo.findById(paId);
        if (!existing || existing.status === 0 || existing.patient_id !== patientId) {
            throw new errors_1.AppError('Patient allergy not found', 404);
        }
        return this.repo.update(paId, {
            ...payload,
            allergyName: payload.allergyName ?? existing.allergyName,
            allergy_id: payload.allergyId ?? existing.allergy_id ?? null,
            updatedBy: userId ?? null,
        });
    }
    async remove(patientId, paId, userId) {
        await this.ensurePatientActive(patientId);
        const existing = await this.repo.findById(paId);
        if (!existing || existing.status === 0 || existing.patient_id !== patientId) {
            throw new errors_1.AppError('Patient allergy not found', 404);
        }
        return this.repo.update(paId, {
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
exports.PatientAllergyService = PatientAllergyService;
