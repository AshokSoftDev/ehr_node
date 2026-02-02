"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionTemplateService = void 0;
const errors_1 = require("../../../utils/errors");
const prescriptionTemplate_repository_1 = require("./prescriptionTemplate.repository");
class PrescriptionTemplateService {
    constructor() {
        this.repo = new prescriptionTemplate_repository_1.PrescriptionTemplateRepository();
    }
    async list(templateId, search) {
        return this.repo.list(templateId, search);
    }
    async create(payload, userId) {
        return this.repo.create({
            template_id: payload.template_id,
            template_name: payload.template_name,
            drug_id: payload.drug_id ?? null,
            drug_name: payload.drug_name,
            drug_generic: payload.drug_generic ?? null,
            drug_type: payload.drug_type ?? null,
            drug_dosage: payload.drug_dosage ?? null,
            drug_measure: payload.drug_measure ?? null,
            instruction: payload.instruction ?? null,
            duration: payload.duration ?? null,
            duration_type: payload.duration_type ?? null,
            quantity: payload.quantity ?? null,
            morning_bf: payload.morning_bf ?? false,
            morning_af: payload.morning_af ?? false,
            noon_bf: payload.noon_bf ?? false,
            noon_af: payload.noon_af ?? false,
            evening_bf: payload.evening_bf ?? false,
            evening_af: payload.evening_af ?? false,
            night_bf: payload.night_bf ?? false,
            night_af: payload.night_af ?? false,
            notes: payload.notes ?? null,
            createdBy: userId ?? null,
            updatedBy: userId ?? null,
        });
    }
    async bulkCreate(items, userId) {
        const data = items.map(payload => ({
            template_id: payload.template_id,
            template_name: payload.template_name,
            drug_id: payload.drug_id ?? null,
            drug_name: payload.drug_name,
            drug_generic: payload.drug_generic ?? null,
            drug_type: payload.drug_type ?? null,
            drug_dosage: payload.drug_dosage ?? null,
            drug_measure: payload.drug_measure ?? null,
            instruction: payload.instruction ?? null,
            duration: payload.duration ?? null,
            duration_type: payload.duration_type ?? null,
            quantity: payload.quantity ?? null,
            morning_bf: payload.morning_bf ?? false,
            morning_af: payload.morning_af ?? false,
            noon_bf: payload.noon_bf ?? false,
            noon_af: payload.noon_af ?? false,
            evening_bf: payload.evening_bf ?? false,
            evening_af: payload.evening_af ?? false,
            night_bf: payload.night_bf ?? false,
            night_af: payload.night_af ?? false,
            notes: payload.notes ?? null,
            createdBy: userId ?? null,
            updatedBy: userId ?? null,
        }));
        return this.repo.bulkCreate(data);
    }
    async update(tempId, payload, userId) {
        const template = await this.getTemplateOrThrow(tempId);
        return this.repo.update(template.temp_id, {
            ...payload,
            updatedBy: userId ?? null,
        });
    }
    async remove(tempId, userId) {
        const template = await this.getTemplateOrThrow(tempId);
        return this.repo.update(template.temp_id, {
            status: 0,
            deletedAt: new Date(),
            deletedBy: userId ?? null,
        });
    }
    async getOne(tempId) {
        return this.getTemplateOrThrow(tempId);
    }
    async getTemplateOrThrow(tempId) {
        const template = await this.repo.findById(tempId);
        if (!template || template.status === 0) {
            throw new errors_1.AppError('Prescription template not found', 404);
        }
        return template;
    }
}
exports.PrescriptionTemplateService = PrescriptionTemplateService;
