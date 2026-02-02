"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DentalHpiService = void 0;
const errors_1 = require("../../../utils/errors");
const dentalHpi_repository_1 = require("./dentalHpi.repository");
class DentalHpiService {
    constructor() {
        this.repo = new dentalHpi_repository_1.DentalHpiRepository();
    }
    async listByVisit(visitId) {
        await this.ensureVisitExists(visitId);
        return this.repo.listByVisit(visitId);
    }
    async getOne(visitId, hpiId) {
        return this.getHpiForVisitOrThrow(visitId, hpiId);
    }
    async create(visitId, payload, userId) {
        const visit = await this.ensureVisitExists(visitId);
        return this.repo.create({
            visit_id: visit.visit_id,
            patient_id: visit.patient_id,
            doctor_id: visit.doctor_id,
            dentition_type: payload.dentition_type,
            teeth_surfaces: payload.teeth_surfaces,
            chief_complaints: payload.chief_complaints,
            severity: payload.severity ?? null,
            duration_years: payload.duration_years ?? 0,
            duration_months: payload.duration_months ?? 0,
            duration_weeks: payload.duration_weeks ?? 0,
            duration_days: payload.duration_days ?? 0,
            notes: payload.notes ?? null,
            createdBy: userId ?? null,
            updatedBy: userId ?? null,
        });
    }
    async update(visitId, hpiId, payload, userId) {
        const hpi = await this.getHpiForVisitOrThrow(visitId, hpiId);
        return this.repo.update(hpi.hpi_id, {
            ...(payload.dentition_type !== undefined && { dentition_type: payload.dentition_type }),
            ...(payload.teeth_surfaces !== undefined && { teeth_surfaces: payload.teeth_surfaces }),
            ...(payload.chief_complaints !== undefined && { chief_complaints: payload.chief_complaints }),
            ...(payload.severity !== undefined && { severity: payload.severity }),
            ...(payload.duration_years !== undefined && { duration_years: payload.duration_years }),
            ...(payload.duration_months !== undefined && { duration_months: payload.duration_months }),
            ...(payload.duration_weeks !== undefined && { duration_weeks: payload.duration_weeks }),
            ...(payload.duration_days !== undefined && { duration_days: payload.duration_days }),
            ...(payload.notes !== undefined && { notes: payload.notes }),
            updatedBy: userId ?? null,
        });
    }
    async remove(visitId, hpiId, userId) {
        const hpi = await this.getHpiForVisitOrThrow(visitId, hpiId);
        return this.repo.delete(hpi.hpi_id, userId);
    }
    async ensureVisitExists(visitId) {
        const visit = await this.repo.findVisitById(visitId);
        if (!visit || visit.status === 0) {
            throw new errors_1.AppError('Visit not found', 404);
        }
        return visit;
    }
    async getHpiForVisitOrThrow(visitId, hpiId) {
        const hpi = await this.repo.findById(hpiId);
        if (!hpi || hpi.status === 0 || hpi.visit_id !== visitId) {
            throw new errors_1.AppError('Dental HPI entry not found', 404);
        }
        return hpi;
    }
}
exports.DentalHpiService = DentalHpiService;
