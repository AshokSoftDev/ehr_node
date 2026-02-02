"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergyService = void 0;
const errors_1 = require("../../../utils/errors");
const allergy_repository_1 = require("./allergy.repository");
class AllergyService {
    constructor() {
        this.repo = new allergy_repository_1.AllergyRepository();
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
            throw new errors_1.AppError('Allergy not found', 404);
        return this.repo.update(id, { ...dto, updatedBy: userId });
    }
    async remove(id, userId) {
        const existing = await this.repo.findById(id);
        if (!existing)
            throw new errors_1.AppError('Allergy not found', 404);
        return this.repo.softDelete(id, userId);
    }
}
exports.AllergyService = AllergyService;
