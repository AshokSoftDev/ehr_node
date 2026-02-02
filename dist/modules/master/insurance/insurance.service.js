"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceService = void 0;
const errors_1 = require("../../../utils/errors");
const insurance_repository_1 = require("./insurance.repository");
class InsuranceService {
    constructor() {
        this.repo = new insurance_repository_1.InsuranceRepository();
    }
    async list(filters) {
        return this.repo.findAll(filters);
    }
    async create(dto, userId) {
        return this.repo.create({ ...dto, createdBy: userId, updatedBy: userId });
    }
    async update(id, dto, userId) {
        const existing = await this.repo.findById(id);
        if (!existing)
            throw new errors_1.AppError('Insurance not found', 404);
        return this.repo.update(id, { ...dto, updatedBy: userId });
    }
    async remove(id, userId) {
        const existing = await this.repo.findById(id);
        if (!existing)
            throw new errors_1.AppError('Insurance not found', 404);
        return this.repo.softDelete(id, userId);
    }
}
exports.InsuranceService = InsuranceService;
