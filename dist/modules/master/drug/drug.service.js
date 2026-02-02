"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugService = void 0;
const errors_1 = require("../../../utils/errors");
const drug_repository_1 = require("./drug.repository");
class DrugService {
    constructor() {
        this.repo = new drug_repository_1.DrugRepository();
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
            throw new errors_1.AppError('Drug not found', 404);
        return this.repo.update(id, { ...dto, updatedBy: userId });
    }
    async remove(id, userId) {
        const existing = await this.repo.findById(id);
        if (!existing)
            throw new errors_1.AppError('Drug not found', 404);
        return this.repo.softDelete(id, userId);
    }
}
exports.DrugService = DrugService;
